import { View, Text, Image, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { images } from "@/constants/images";
import FilmCard from "@/components/FilmCard";
import useFetch from "@/services/useFetch";
import { fetchFilms } from "@/services/api";

import { icons } from "@/constants/icons";
import SearchBar from "@/components/SearchBar";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: films,
    loading: filmsLoading,
    error: filmsError,
    refetch: loadFilms,
    reset,
  } = useFetch(() => fetchFilms({ query: searchQuery }), false);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadFilms();
      } else {
        reset();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        data={films}
        renderItem={({ item }) => <FilmCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        className="px-5"
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10"></Image>
            </View>

            <View className="my-5">
              <SearchBar
                placeholder="Search for a film"
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
              />
            </View>

            {filmsLoading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}

            {filmsError && (
              <Text className="text-red-500 px-5 my-3">
                Error: {filmsError?.message}
              </Text>
            )}

            {!filmsLoading &&
              !filmsError &&
              searchQuery.trim() &&
              films?.length! > 0 && (
                <Text className="text-xl text-white font-bold">
                  Search results for{" "}
                  <Text className="text-accent">{searchQuery}</Text>
                </Text>
              )}
          </>
        }
        ListEmptyComponent={
          !filmsLoading && !filmsError ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {searchQuery.trim() ? "No films found" : "Search for a film"}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Search;
