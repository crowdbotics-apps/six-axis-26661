import stripe
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from stripe.error import CardError

stripe.api_key = settings.STRIPE_LIVE_SECRET_KEY if settings.STRIPE_LIVE_MODE else settings.STRIPE_TEST_SECRET_KEY


class PaymentViewSet(ViewSet):
    permission_classes = [IsAuthenticated]

    def get_customer_id(self, request):
        if not request.user.stripe_customer_id:
            customer = stripe.Customer.create(
                description="Customer for {}".format(request.user.email),
                email=request.user.email
            )
            request.user.stripe_customer_id = customer.id
            request.user.save()
        return request.user.stripe_customer_id

    @action(detail=False, methods=['get'])
    def get_cards(self, request):
        stripe_customer_id = self.get_customer_id(request)
        cards = stripe.Customer.list_sources(
            stripe_customer_id,
            object="card",
        )
        # customer = stripe.Customer.retrieve(stripe_customer_id)
        return Response(cards)
        # return Response({
        #     "cards": cards.data,
        #     "default_card": customer.default_source
        # })

    @action(detail=False, methods=['post'])
    def create_card(self, request):
        try:
            stripe_customer_id = self.get_customer_id(request)
            card = stripe.Customer.create_source(
                stripe_customer_id,
                source=request.data['card_token'],
            )
            # default_card = request.data.get('default_card', False)
            # if default_card:
            #     stripe.Customer.modify(stripe_customer_id,
            #                            default_source=card.id)
            return Response(card)
        except CardError as e:
            return Response(data=e.error, status=e.http_status)

    # @action(detail=False, methods=['post'])
    # def set_default_card(self, request):
    #     try:
    #         if request.user.stripe_customer_id:
    #             # default_card = request.data.get('default_card', False)
    #             # if default_card:
    #             stripe.Customer.modify(request.user.stripe_customer_id, source=request.data['card_token'])
    #             return Response()
    #         return Response("User not a customer", status=status.HTTP_400_BAD_REQUEST)
    #     except CardError as e:
    #         return Response(data=e.error, status=e.http_status)
    #
    # @action(detail=False, methods=['post'])
    # def update_card(self, request):
    #     data = {}
    #     if 'address_city' in request.data:
    #         data['address_city'] = request.data['address_city']
    #     if 'address_country' in request.data:
    #         data['address_country'] = request.data['address_country']
    #     if 'address_line1' in request.data:
    #         data['address_line1'] = request.data['address_line1']
    #     if 'address_line2' in request.data:
    #         data['address_line2'] = request.data['address_line2']
    #     if 'address_state' in request.data:
    #         data['address_state'] = request.data['address_state']
    #     if 'address_zip' in request.data:
    #         data['address_zip'] = request.data['address_zip']
    #     if 'exp_month' in request.data:
    #         data['exp_month'] = request.data['exp_month']
    #     if 'exp_year' in request.data:
    #         data['exp_year'] = request.data['exp_year']
    #     if 'name' in request.data:
    #         data['name'] = request.data['name']
    #     if request.user.stripe_customer_id:
    #         card = stripe.Customer.modify_source(
    #             request.user.stripe_customer_id,
    #             request.data['card_id'],
    #             **data
    #         )
    #         default_card = request.data.get('default_card', False)
    #         if default_card:
    #             stripe.Customer.modify(request.user.stripe_customer_id,
    #                                    default_source=request.data['card_id'])
    #         return Response(card)
    #     return Response("User not a customer", status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def delete_card(self, request):
        stripe_customer_id = self.get_customer_id(request)
        response = stripe.Customer.delete_source(
            stripe_customer_id,
            request.data['card_id']
        )
        return Response(response)

    @action(detail=False, methods=['post'])
    def subscribe(self, request):
        try:
            stripe_customer_id = self.get_customer_id(request)
            user = self.request.user
            email = user.email
            payment_method_id = request.data['payment_method_id']
            price_id = request.data['price_id']

            price_object = stripe.Price.retrieve(price_id)

            stripe.PaymentIntent.create(
                customer=stripe_customer_id,
                payment_method=payment_method_id,
                currency='usd',  # you can provide any currency you want
                amount=price_object.unit_amount,
                confirm=True
            )

            stripe.Subscription.create(
                customer=stripe_customer_id,
                items=[{
                    'price': price_id  # here paste your price id
                }]
            )
            user.is_subscribe = True
            user.save()
            return Response(status=status.HTTP_201_CREATED)
        except CardError as e:
            return Response(data=e.error, status=e.http_status)

    @action(detail=False, methods=['post'])
    def create_subscription_price(self, request):
        try:
            amount = request.data['amount']
            interval = request.data['intercal']  # either day, week, month or year.
            stripe.Price.create(
                unit_amount=amount*100,
                currency="usd",
                recurring={"interval": interval},
                product="prod_KpDIcbJPl5WNG0", # Test Mode Product
            )
            return Response(status=status.HTTP_201_CREATED)
        except CardError as e:
            return Response(data=e.error, status=e.http_status)

    @action(detail=False, methods=['get'])
    def get_subscription_price(self, request):
        try:
            price_list = stripe.Price.list(limit=3)
            return Response(price_list)
        except CardError as e:
            return Response(data=e.error, status=e.http_status)

    @action(detail=False, methods=['post'])
    def delete_subscription_price(self, request):
        try:
            price_id = request.data['price_id']
            stripe.Price.modify(
                price_id,
                active=False,
            )
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CardError as e:
            return Response(data=e.error, status=e.http_status)
