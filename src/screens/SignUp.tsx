import { useNavigation } from '@react-navigation/native';
import { VStack, Image, Text, Center, Heading, ScrollView, Toast } from 'native-base';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useAuth } from '@hooks/useAuth';
import { api } from '@services/api';

import LogoSvg from '@assets/logo.svg';
import BackgroundImg from '@assets/background.png';

import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { AppError } from '@utils/AppError';
import { useState } from 'react';

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
}

const signUpSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  password: yup.string().required('Senha é obrigatória').min(6, 'A senha precisa ter no mínimo 6 caracteres'),
  password_confirm: yup.string().oneOf([
    null, yup.ref('password')
  ], 'As senhas precisam ser iguais').required('Confirmação de senha é obrigatória')
});

export function SignUp(){
  const [isLoading, setIsLoading] = useState(false);

  const { 
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema)
  });

  const navigation = useNavigation();
  const { signIn } = useAuth();

  function handleGoBack(){
    navigation.goBack();
  }

  async function handleSignUp({ name, email, password }: FormDataProps){
    setIsLoading(true);
    try{
      await api.post('/users', { name, email, password });
      await signIn( email, password );

    } catch(error){
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Ocorreu um erro ao fazer o cadastro';
      setIsLoading(false);

      Toast.show({
        title: title,
        placement: 'top',
        bgColor: 'red.500'
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} >
      <VStack flex={1} px={10} >
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Background"
          resizeMode="contain"
          position="absolute"
        />

        <Center my={24}  >
          <LogoSvg/>

          <Text color="gray.100" fontSize="sm" >
            Treine sua mente e o seu corpo
          </Text>
        </Center>

        <Center>
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading" >
            Crie sua conta
          </Heading>

          <Controller
            name='name'
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input 
                value={value}
                placeholder='Nome'
                onChangeText={onChange}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            name='email'
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                value={value}
                placeholder='E-mail'
                autoCapitalize='none'
                onChangeText={onChange}
                keyboardType='email-address'
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            name='password'
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input 
                value={value}
                secureTextEntry
                placeholder='Senha'
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            name='password_confirm'
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                value={value}
                secureTextEntry
                onChangeText={onChange}
                placeholder='Confirmar Senha'
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType='send'
                errorMessage={errors.password_confirm?.message}
              />
            )}
          />

          <Button
            title='Criar e Acessar'
            onPress={handleSubmit(handleSignUp)}
            isLoading={isLoading}
          />
        </Center>

        <Button title='Voltar para o login' variant="outline" mt={16} onPress={handleGoBack} />

      </VStack>
    </ScrollView>
  )
}