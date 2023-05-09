import { useCallback, useEffect, useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { FlatList, HStack, Heading, Text, Toast, VStack } from "native-base";

import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { ExerciseCard } from "@components/ExerciseCard";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { Loading } from "@components/Loading";

export function Home(){
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<string[]>([]);
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
  
  const [groupSelected, setGroupSelected] = useState("antebraço");

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleOpenExerciseDetails( exerciseId: string ){
    navigation.navigate("exercise", { exerciseId });
  }

  async function fetchGroups() {
   try {
    const response = await api.get("/groups");
    setGroups(response.data);

   } catch (error) {
    const isAppError = error instanceof AppError;
    const title = isAppError ? error.message : "Nao foi possivel carregar os grupos";
    
    Toast.show({
      title,
      placement: "top",
      bgColor: "red.500"
    });
   }
  }

  async function fetchExercisesByGroup() {
    setIsLoading(true);
    try {
      const response = await api.get(`/exercises/bygroup/${groupSelected}`);
      setExercises(response.data);

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : "Nao foi possivel carregar os exercicios";
    
      Toast.show({
        title,
        placement: "top",
        bgColor: "red.500"
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  useFocusEffect(useCallback(() => {
    fetchExercisesByGroup();
  }, [groupSelected]));
  
  useEffect(() => {
    fetchGroups();
  }, []);
  

  return(
    <VStack flex={1} >
      <HomeHeader/>

      <FlatList
        data={groups}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ px: 5 }}
        my={5}
        maxH={10}
        minH={10}
      />

      
      <VStack flex={1} px={5} >
        <HStack justifyContent="space-between" mb={5} >
          <Heading fontSize="md" color="gray.200" fontFamily="heading" >
            Exercícios
          </Heading>

          <Text fontSize="sm" color="gray.200" >
            {exercises.length}
          </Text>
        </HStack>

        
        { !isLoading ?
          <FlatList
            data={exercises}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ExerciseCard onPress={() => handleOpenExerciseDetails(item.id)} data={item} />
            )}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{ pb: 20 }}
          />
        :
          <Loading/>
        }
        
      </VStack>
      
    </VStack>
  );
}