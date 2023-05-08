import { useState } from "react";
import { TouchableOpacity, LogBox, Alert } from "react-native";
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from "native-base";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { UserPhoto } from "@components/UserPhoto";
import { ScreenHeader } from "@components/ScreenHeader";

const PHOTO_SIZE = 33;
LogBox.ignoreAllLogs();

export function Profile(){
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState('https://upload.wikimedia.org/wikipedia/commons/2/23/Lil-Peep_PrettyPuke_Photoshoot.png')

  const toast = useToast();

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
        setUserPhoto(photoSelected.assets[0].uri);
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
              source={{
                uri: userPhoto,
              }}
              size={PHOTO_SIZE}
              alt="Imagem de Perfil"
            />
          }
          <TouchableOpacity onPress={handleSelectImage}>
            <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8} >
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Input
            bg="gray.600"
            placeholder="Nome"
          />

          <Input
            bg="gray.600"
            placeholder="E-Mail"
            isDisabled
          />
        </Center>

        <VStack px={10} mt={12} mb={9} >
          <Heading color="gray.200" fontSize="md" mb="2" fontFamily="heading" >
            Alterar senha
          </Heading>

          <Input
            bg="gray.600"
            placeholder="Senha antiga"
            secureTextEntry
          />

          <Input
            bg="gray.600"
            placeholder="Nova senha"
            secureTextEntry
          />

          <Input
            bg="gray.600"
            placeholder="Confirmar nova senha"
            secureTextEntry
          />

          <Button
            title="Atualizar"
            mt={4}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}