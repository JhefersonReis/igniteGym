import { useState } from "react";
import { FlatList, HStack, Heading, Text, VStack } from "native-base";

import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { ExerciseCard } from "@components/ExerciseCard";

export function Home(){
  const [groups, setGroups] = useState(
  ["costas", "Biceps", "Triceps", "Peito", "Ombro", "Perna", "Abdomen"]);
  const [exercises, setExercises] = useState(['Puxada frontal', 'Remada curvada', 'Remada unilateral', 'Levantamento terra']);
  
  const [groupSelected, setGroupSelected] = useState("costas");

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
      />

      <VStack flex={1} px={5} >
        <HStack justifyContent="space-between" mb={5} >
          <Heading fontSize="md" color="gray.200" >
            Exercícios
          </Heading>

          <Text fontSize="sm" color="gray.200" >
            {exercises.length}
          </Text>
        </HStack>

        <FlatList
          data={exercises}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <ExerciseCard />
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 20 }}
        />
      </VStack>
    </VStack>
  );
}