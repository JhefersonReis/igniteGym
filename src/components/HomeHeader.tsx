import { HStack, Heading, Text, VStack, Icon } from "native-base";
import { UserPhoto } from "./UserPhoto";
import { MaterialIcons } from "@expo/vector-icons";

export function HomeHeader() {
  return (
    <HStack bg="gray.600" pt={16} pb={8} px={8} alignItems="center">
      <UserPhoto
        source={{
          uri: "https://upload.wikimedia.org/wikipedia/commons/2/23/Lil-Peep_PrettyPuke_Photoshoot.png",
        }}
        size={12}
        mr={4}
        alt="Jheferson"
      />

      <VStack flex={1}>
        <Text color="gray.100" fontSize="md">
          Olá,
        </Text>

        <Heading color="gray.100" fontSize="md" fontFamily="heading" >
          Jheferson
        </Heading>
      </VStack>

      <Icon as={MaterialIcons} name="logout" color="gray.200" size={7} />
    </HStack>
  );
}
