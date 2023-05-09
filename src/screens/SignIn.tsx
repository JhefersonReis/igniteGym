import { VStack, Image, Text, Center, Heading, ScrollView, Toast } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useAuth } from '@hooks/useAuth';

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import LogoSvg from '@assets/logo.svg';
import BackgroundImg from '@assets/background.png';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { AppError } from '@utils/AppError';
import { useState } from 'react';

type LoginFormDataProps = {
  email: string;
  password: string;
};

const loginSchema = yup.object().shape({
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  password: yup.string().required('Senha é obrigatória'),
});

export function SignIn(){
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormDataProps>({
    resolver: yupResolver(loginSchema)
  });

  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  function handleNewAccount(){
    navigation.navigate('signUp');
  }


  async function handleSignIn({ email, password }: LoginFormDataProps){
    setIsLoading(true);
    try{
      await signIn(email, password);
    }catch(error){
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Algo deu errado, tente novamente mais tarde!';

      if(isAppError){
        Toast.show({
          title,
          bgColor: 'red.500',
          placement: 'top'
        });
      }
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
            Acesse sua conta
          </Heading>

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
                returnKeyType='send'
                onSubmitEditing={handleSubmit(handleSignIn)}
              />
            )}
          />

          <Button
            title='Acessar'
            onPress={handleSubmit(handleSignIn)}
            isLoading={isLoading}
          />

        </Center>

        <Center mt={24} >
          <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body" >
            Ainda não tem acesso?
          </Text>

          <Button title='Criar conta' variant="outline" onPress={handleNewAccount} />
        </Center>

      </VStack>
    </ScrollView>
  )
}