import { useState } from "react";
import { TouchableOpacity, LogBox, Alert } from "react-native";
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from "native-base";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as yup from "yup";

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { UserPhoto } from "@components/UserPhoto";
import { ScreenHeader } from "@components/ScreenHeader";
import { useAuth } from "@hooks/useAuth";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import PhotoUserSvg from '@assets/userPhotoDefault.png'

const PHOTO_SIZE = 33;
LogBox.ignoreAllLogs();

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  old_password: string;
  confirm_password: string;
}

const profileSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  password: yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres').nullable().transform(value => value === '' ? null : value),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => !!value ? value : null)
    .oneOf([yup.ref('password'), null], 'As senhas devem ser iguais')
    .when('password', (value: any, schema: any) => {
      if (value > 0) return schema.required('Confirmação de senha é obrigatória');
    }
  ),
});

export function Profile(){
  const [updating, setUpdating] = useState(false);
  const [photoIsLoading, setPhotoIsLoading] = useState(false);

  const toast = useToast();
  const { user, updateUserProfile } = useAuth();
  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema)
  });

  async function handleSelectImage(){
    setPhotoIsLoading(true);
    try{
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4,4],
        allowsEditing: true
      });
  
      if(photoSelected.canceled){
        return;
      }

      if(photoSelected.assets[0].uri){
        const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri);

        if(photoInfo.exists){
          console.log(photoInfo.size)
          if(photoInfo.size && (photoInfo.size / 1024 / 1024 ) > 5){
            return toast.show({
              title: 'Essa imagem é muito grande. Selecione uma até 5MB.',
              placement: 'top',
              bgColor: 'red.500'
            })
          }
        }

        const fileExtension = photoSelected.assets[0].uri.split('.').pop();

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`
        } as any;

        const userPhotoUploadForm = new FormData();

        userPhotoUploadForm.append('avatar', photoFile);

        const avatarUpdtedResponse = await api.patch('/users/avatar', userPhotoUploadForm, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        const userUpdated = user;

        userUpdated.avatar = avatarUpdtedResponse.data.avatar;

        await updateUserProfile(userUpdated);

        toast.show({
          title: 'Foto atualizada com sucesso!',
          placement: 'top',
          bgColor: 'green.600'
        })
      }

    } catch(error){
      console.log(error);
    } finally {
      setPhotoIsLoading(false);
    }
  }

  async function handleProfileUpdate(data: FormDataProps){
    setUpdating(true);
    try {
      await api.put('/users', data);

      const userUpdated = user;
      userUpdated.name = data.name;
      
      await updateUserProfile(userUpdated);

      toast.show({
        title: 'Perfil atualizado com sucesso!',
        placement: 'top',
        bgColor: 'green.600'
      });
      
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Ocorreu um erro ao atualizar o perfil.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      });
      
    } finally {
      setUpdating(false);
    }
  }

  return(
    <VStack flex={1} >
      <ScreenHeader title="Perfil" />

      <ScrollView showsVerticalScrollIndicator={false} >
        <Center mt={6} px={10} >
          {
            photoIsLoading ?
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded="full"
              startColor="gray.500"
              endColor="gray.300"
            />
          :
            <UserPhoto
              source={ user.avatar ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` } : PhotoUserSvg }
              size={PHOTO_SIZE}
              alt="Imagem de Perfil"
            />
          }

          <TouchableOpacity onPress={handleSelectImage}>
            <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8} >
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                bg="gray.600"
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
            name="name"
          />

          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                bg="gray.600"
                placeholder="E-Mail"
                isDisabled
                onChangeText={onChange}
                value={value}
              />
            )}
            name="email"
          />
        </Center>

        <VStack px={10} mt={12} mb={9} >
          <Heading color="gray.200" fontSize="md" mb="2" fontFamily="heading" >
            Alterar senha
          </Heading>

          <Controller
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Senha antiga"
                secureTextEntry
                onChangeText={onChange}
              />
            )}
            name="old_password"
          />

          <Controller
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Nova senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            )}
            name="password"
          />

          <Controller
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Confirmar nova senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.confirm_password?.message}
              />
            )}
            name="confirm_password"
          />

          <Button
            title="Atualizar"
            mt={4}
            onPress={handleSubmit(handleProfileUpdate)}
            isLoading={updating}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}