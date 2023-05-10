import { useCallback, useState } from "react";
import { Heading, VStack, SectionList, Center, HStack, Toast } from "native-base";

import { ScreenHeader } from "@components/ScreenHeader";
import { HistoryCard } from "@components/HistoryCard";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";
import { useFocusEffect } from "@react-navigation/native";
import { HistoryByDayDTO } from "@dtos/HistoryByDayDTO";

export function History(){
  const [isLoading, setIsLoading] = useState(true);
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([]);

  async function fetchHistory() {
    setIsLoading(true);
    try {
      const response = await api.get('/history');
      setExercises(response.data);

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : "Não foi possivel carregar o historico de exercicios";
      
      Toast.show({
        title,
        placement: "top",
        bgColor: "red.500"
      });
    }
  }

  useFocusEffect(useCallback(() => {
    fetchHistory();
  }, []));


  return(
    <VStack flex={1} >
      <ScreenHeader title="Historico de Exercicios" />

      <SectionList
        sections={exercises}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <HistoryCard data={item} />}
        renderSectionHeader={({ section }) => (
          <Heading color="gray.200" fontSize="md" mt={10} mb={3} fontFamily="heading">
            {section.title}
          </Heading>
        )}
        px={5}
        contentContainerStyle={
          exercises.length === 0 && { flex: 1, justifyContent: 'center' }
        }
        ListEmptyComponent={() => (
          <Heading color="gray.200" fontSize="md" textAlign="center" fontFamily="heading" >
            Não há exercícios realizados ainda 😢 {'\n'}
            Vamos treinar?
          </Heading>
        )}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
      />
    </VStack>
  );
}