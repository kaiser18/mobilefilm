import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { fetchFilmDetails } from "@/services/api";
import useFetch from "@/services/useFetch";
import { icons } from "@/constants/icons";

interface FilmInfoProps {
  label: string;
  value?: string | number | null;
}

const FilmInfo = ({ label, value }: FilmInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const FilmDetails = () => {
  const { id } = useLocalSearchParams();

  const { data: film, loading } = useFetch(() =>
    fetchFilmDetails(id as string)
  );

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${film?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />
        </View>
        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">{film?.title}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {film?.release_date?.split("-")[0]}
            </Text>
            <Text className="text-light-200 text-sm">{film?.runtime}m</Text>
          </View>
          <View className="flex-row items-center bg-dark-100 px-2 py-1 roundend-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />
            <Text className="text-white font-bold text-sm">
              {(film?.vote_average ?? 0).toPrecision(2)}/10
            </Text>
            <Text className="text-light-200 text-sm">
              ({film?.vote_count} votes)
            </Text>
          </View>
          <FilmInfo label="Overview" value={film?.overview} />
          <FilmInfo
            label="Genres"
            value={film?.genres?.map((g) => g.name).join(" - ") || "N/A"}
          />
          <View className="flex flex-row justify-between w-1/2">
            <FilmInfo
              label="Budget"
              value={`$${(film?.budget ?? 0) / 1_000_000} million`}
            />
            <FilmInfo
              label="Revenue"
              value={`$${Math.round((film?.revenue ?? 0) / 1_000_000)} million`}
            />
          </View>
          <FilmInfo
            label="Production Companies"
            value={
              film?.production_companies.map((c) => c.name).join(" - ") || "N/A"
            }
          />
        </View>
      </ScrollView>
      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Text className="text-white font-semibold text-base">Go back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FilmDetails;
