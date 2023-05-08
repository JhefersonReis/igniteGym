import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Center, ScrollView, Text, VStack } from "native-base";

export function Profile(){
  return(
    <VStack flex={1} >
      <ScreenHeader title="Perfil" />

      <ScrollView>
        <Center mt={6} px={10} >
          <UserPhoto
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/2/23/Lil-Peep_PrettyPuke_Photoshoot.png",
            }}
            size={33}
            alt="Imagem de Perfil"
          />
        </Center>

      </ScrollView>
    </VStack>
  );
}