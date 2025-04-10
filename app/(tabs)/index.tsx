import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import {
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  Text,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { fetchFilms } from "@/services/api";
import useFetch from "@/services/useFetch";
import FilmCard from "@/components/FilmCard";
import { getTrendingFilms } from "@/services/appwrite";
import TrendingCard from "@/components/TrendingCard";

export default function Index() {
  const router = useRouter();
  const {
    data: trendingFilms,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingFilms);
  const {} = useFetch(getTrendingFilms);

  const {
    data: films,
    loading: filmsLoading,
    error: filmsError,
  } = useFetch(() => fetchFilms({ query: "" }));

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        {filmsLoading || trendingLoading ? (
          <ActivityIndicator
            size="large"
            color="0000ff"
            className="mt-10 self-center"
          />
        ) : filmsError || trendingError ? (
          <Text className="text-white">
            Error: {filmsError?.message || trendingError?.message}
          </Text>
        ) : (
          <View className="flex-1 mt-5">
            <SearchBar
              onPress={() => router.push("/search")}
              placeholder="Search for a film"
            />

            {trendingFilms && (
              <View className="mt-10">
                <Text className="text-lg text-white font-bold mb-3">
                  Trending Films
                </Text>

                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View className="w-4" />}
                  className="mb-4 mt-3"
                  data={trendingFilms}
                  renderItem={({ item, index }) => (
                    <TrendingCard film={item} index={index} />
                  )}
                  keyExtractor={(item) => item.film_id.toString()}
                />
              </View>
            )}

            <>
              <Text className="text-lg text-white font-bold mt-5 mb-3">
                Latest Films
              </Text>

              <FlatList
                data={films}
                renderItem={({ item }) => <FilmCard {...item} />}
                keyExtractor={(item) => item.id}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10,
                }}
                className="mt-2 pb-32"
                scrollEnabled={false}
              />
            </>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
