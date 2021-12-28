import React, { Component } from "react";
import { View, ActivityIndicator, Modal, StyleSheet } from "react-native";

export default Loader = (props) => {
  //console.log('loader is called')
  if (props.showLoading) {
    return (
      <View
        style={[
          {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#80808066",
          },
          props.style,
        ]}
      >
        <ActivityIndicator size="large" color={"red"} />
      </View>
    );
  } else {
    return null;
  }
};
