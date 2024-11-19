import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { API_BASE_URL } from '../../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({navigation}) => {
    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); 
    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    };

    const handleLogin = async () =>{
        if (!validateEmail(inputEmail)) {
            setErrorMessage('Email không hợp lệ');
            return;
        }

        setErrorMessage('');
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'platform': 'mobile',
                },
                body: JSON.stringify({
                    email: inputEmail,
                    password: inputPassword,
                }),
            });
            
            const result = await response.json();
            
            if (response.ok) {
                 await AsyncStorage.setItem('token', result.token);
                 await AsyncStorage.setItem('user', JSON.stringify(result.user));
                 navigation.navigate('Tabs');
            } else {
                setErrorMessage(result.message);
                console.log('loi');
                
            }
        } catch (error) {
            console.error('Lỗi khi đăng nhập:', error);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.centeredView}>
                <Image
                    source={{
                        uri: 'https://marketplace.canva.com/EAFpeiTrl4c/1/0/1600w/canva-abstract-chef-cooking-restaurant-free-logo-9Gfim1S8fHg.jpg',
                    }}
                    style={styles.image}
                />
            </View>
            <View style={styles.centeredView}>
                <Text style={styles.title}>Đăng nhập</Text>
                <TextInput
                    placeholder="Email"
                    value={inputEmail}
                    onChangeText={(text) => setInputEmail(text)}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <TextInput
                    placeholder="Mật khẩu"
                    value={inputPassword}
                    onChangeText={(text) => setInputPassword(text)}
                    style={styles.input}
                    secureTextEntry
                />
                {errorMessage ? (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                ) : null}
                <TouchableOpacity style={styles.button} 
                onPress={() => handleLogin()}>
                    <Text style={styles.buttonText}>Đăng nhập</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centeredView: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '40%',
        height: '35%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        width: '70%',
        borderWidth: 1,
        borderRadius: 7,
        borderColor: 'grey',
        paddingHorizontal: 15,
        height: 50,
        marginBottom: 15,
    },
    button: {
        width: '70%',
        height: 50,
        backgroundColor: '#d74011',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});

export default LoginScreen;
