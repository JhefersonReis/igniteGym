import { HStack, Heading, Text, VStack, Icon } from "native-base";
import { UserPhoto } from "./UserPhoto";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@hooks/useAuth";

import PhotoUserSvg from '@assets/userPhotoDefault.png'
import { TouchableOpacity } from "react-native";

export function HomeHeader() {
  const { user, signOut } = useAuth();

  return (
    <HStack bg="gray.600" pt={16} pb={8} px={8} alignItems="center">
      <UserPhoto
        source={ user.avatar ? { uri: user.avatar } : PhotoUserSvg }
        size={12}
        mr={4}
        alt="Foto do usuario"
      />

      <VStack flex={1}>
        <Text color="gray.100" fontSize="md">
          Olá,
        </Text>

        <Heading color="gray.100" fontSize="md" fontFamily="heading" >
          {user.name}
        </Heading>
      </VStack>

      <TouchableOpacity onPress={signOut}>
        <Icon as={MaterialIcons} name="logout" color="gray.200" size={7} />
      </TouchableOpacity>
    </HStack>
  );
}
