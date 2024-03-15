import {useCallback, useRef} from 'react';
import {
  ImageURISource,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
  ViewToken,
} from 'react-native';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import ListItem from './ListItem';
import PaginationElement from './PaginationElement';
import Button from './Button';
import {useNavigation} from '@react-navigation/native';

import {default as theme} from '../../../theme.json';

const pages = [
  {
    text: 'Bersiaplah untuk transaksi tanpa batas',
    image: require('../../assets/images/onboarding/onboarding-img1.png'),
  },
  {
    text: 'Langit-langit digital dipenuhi mimpi dan harapan ',
    image: require('../../assets/images/onboarding/onboarding-img2.png'),
  },
  {
    text: 'Mari bergabung dalam revolusi pembayaran',
    image: require('../../assets/images/onboarding/onboarding-img3.png'),
  },
];

export default function Onboarding() {
  const x = useSharedValue(0);
  const flatListIndex = useSharedValue(0);
  const flatListRef = useAnimatedRef<
    Animated.FlatList<{
      text: string;
      image: ImageURISource;
    }>
  >();

  const navigation = useNavigation();

  const onViewableItemsChanged = useCallback(
    ({viewableItems}: {viewableItems: ViewToken[]}) => {
      flatListIndex.value = viewableItems[0].index ?? 0;
    },
    [],
  );
  const scrollHandle = useAnimatedScrollHandler({
    onScroll: event => {
      x.value = event.contentOffset.x;
    },
  });

  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: {text: string; image: ImageURISource};
      index: number;
    }) => {
      return <ListItem item={item} index={index} x={x} />;
    },
    [x],
  );
  return (
    <SafeAreaView style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        onScroll={scrollHandle}
        horizontal
        scrollEventThrottle={16}
        pagingEnabled={true}
        data={pages}
        keyExtractor={(_, index) => index.toString()}
        bounces={false}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
      />
      <View style={styles.bottomContainer}>
        <PaginationElement length={pages.length} x={x} />
        <Button
          currentIndex={flatListIndex}
          length={pages.length}
          flatListRef={flatListRef}
          navigation={navigation}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme['color-dark-500'],
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    // backgroundColor: theme['color-primary-800'],
  },
});
