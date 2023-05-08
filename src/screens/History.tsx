import { useState } from "react";
import { Heading, VStack, SectionList, Center, HStack } from "native-base";

import { ScreenHeader } from "@components/ScreenHeader";
import { HistoryCard } from "@components/HistoryCard";

export function History(){
  const [exercises, setExercises] = useState([
    {
      title: '26.07.2021',
      data: ['Puxada frontal', 'Puxada traseira', 'Remada baixa']
    },
    {
      title: '27.07.2021',
      data: ['Puxada frontal', 'Voador']
    },
    {
      title: '28.07.2021',
      data: ['Supino reto', 'Supino inclinado', 'Supino declinado', 'Crucifixo']
    }
  ]);

  return(
    <VStack flex={1} >
      <ScreenHeader title="Historico de Exercicios" />

      <SectionList
        sections={exercises}
        keyExtractor={item => item}
        renderItem={({ item }) => <HistoryCard />}
        renderSectionHeader={({ section }) => (
          <Heading color="gray.200" fontSize="md" mt={10} mb={3} >
            {section.title}
          </Heading>
        )}
        px={5}
        contentContainerStyle={
          exercises.length === 0 && { flex: 1, justifyContent: 'center' }
        }
        ListEmptyComponent={() => (
          <Heading color="gray.200" fontSize="md" textAlign="center" >
            Não há exercícios realizados ainda 😢 {'\n'}
            Vamos treinar?
          </Heading>
        )}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  );
}