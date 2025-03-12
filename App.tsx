import React from 'react';
import NavigationMain from './src/navigation';
import { SafeAreaView } from 'react-native';

export default function App() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <NavigationMain />
        </SafeAreaView>
    );
}