import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function ScreenWebView({ route, navigation }) {
    const url = route?.params;

    const handleNavigationStateChange = (navState) => {
        const currentUrl = navState.url;

        if (currentUrl.includes("vnp_SecureHash")) {
            setTimeout(() => {
                navigation.navigate("TableScreen");
            }, 3000); 
        }
    };
    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: url }}
                startInLoadingState={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onNavigationStateChange={handleNavigationStateChange} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});