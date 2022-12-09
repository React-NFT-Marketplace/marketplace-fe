import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mblMenu: false,
  dropdown: false,
  collection_activity_item_data: [],
  trendingCategoryItemData: [],
  sortedtrendingCategoryItemData: [],
  collectiondata: [],
  sortedCollectionData: [],
  rankingData: [],
  filteredRankingData: [],
  walletModal: false,
  listModal: false,
  buyModal: false,
  delistModal: false,
  propertiesModalValue: false,
  trendingCategorySorText: "",

  //props
  buyModalProps: {
    image: "",
    name: "",
    price: 0,
    collectionName: "",
    itemId: undefined,
    chainId: undefined,
  },

  listModalProps: {
    chainId: undefined,
  },

  delistModalProps: {
    chainId: undefined,
    itemId: undefined,
  },
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    openMblMenu: (state) => {
      state.mblMenu = true;
    },
    closeMblMenu: (state) => {
      state.mblMenu = false;
    },

    openDropdown: (state) => {
      state.dropdown = true;
    },
    closeDropdown: (state) => {
      state.dropdown = false;
    },
    handle_collection_activity_item_data: (state, payload) => {
      state.collection_activity_item_data = payload.data;
    },
    walletModalShow: (state) => {
      state.walletModal = true;
    },
    walletModalhide: (state) => {
      state.walletModal = false;
    },
    listModalShow: (state) => {
      document.querySelectorAll("body")[0].classList.add('modal-open');
      state.listModal = true;
    },
    listModalHide: (state) => {
      document.querySelectorAll("body")[0].classList.remove('modal-open');
      state.listModal = false;
    },
    buyModalShow: (state) => {
      document.querySelectorAll("body")[0].classList.add('modal-open');
      state.buyModal = true;
    },
    delistModalHide: (state) => {
      document.querySelectorAll("body")[0].classList.remove('modal-open');
      state.delistModal = false;
    },
    delistModalShow: (state) => {
      document.querySelectorAll("body")[0].classList.add('modal-open');
      state.delistModal = true;
    },
    buyModalHide: (state) => {
      document.querySelectorAll("body")[0].classList.remove('modal-open');
      state.buyModal = false;
    },
    showPropertiesModal: (state) => {
      state.propertiesModalValue = true;
    },
    closePropertiesModal: (state) => {
      state.propertiesModalValue = false;
    },
    updateTrendingCategoryItemData: (state, action) => {
      state.trendingCategoryItemData = action.payload;
      state.sortedtrendingCategoryItemData = action.payload;
    },
    updateTrendingCategorySorText: (state, action) => {
      const sortText = action.payload;
      if (sortText === "Price: Low to High") {
        state.sortedtrendingCategoryItemData =
          state.trendingCategoryItemData.sort(
            (a, b) => a.sortPrice - b.sortPrice
          );
      } else if (sortText === "Price: high to low") {
        state.sortedtrendingCategoryItemData =
          state.trendingCategoryItemData.sort(
            (a, b) => b.sortPrice - a.sortPrice
          );
      } else if (sortText === "Recently Added") {
        state.sortedtrendingCategoryItemData =
          state.trendingCategoryItemData.sort((a, b) => a.addDate - b.addDate);
      } else if (sortText === "Auction Ending Soon") {
        state.sortedtrendingCategoryItemData =
          state.trendingCategoryItemData.sort((a, b) => b.addDate - a.addDate);
      } else {
        state.sortedtrendingCategoryItemData = state.trendingCategoryItemData;
      }
    },
    updateTrendingCategoryItemByInput: (state, action) => {
      const text = action.payload;
      if (text === "Verified Only") {
        state.sortedtrendingCategoryItemData =
          state.trendingCategoryItemData.filter((item) => {
            return item.verified;
          });
      } else if (text === "NFSW Only") {
        state.sortedtrendingCategoryItemData =
          state.trendingCategoryItemData.filter((item) => {
            return item.nfsw;
          });
      } else if (text === "Show Lazy Minted") {
        state.sortedtrendingCategoryItemData =
          state.trendingCategoryItemData.filter((item) => {
            return item.lazyMinted;
          });
      } else {
        state.sortedtrendingCategoryItemData = state.trendingCategoryItemData;
      }
    },
    collectCollectionData: (state, action) => {
      const data = action.payload;
      state.collectiondata = data;
      state.sortedCollectionData = data;
    },
    updateCollectionData: (state, action) => {
      const text = action.payload;
      console.log(text);
      if (text === "trending") {
        const tampItem = state.collectiondata.filter((item) => item.trending);
        state.sortedCollectionData = tampItem;
      }
      if (text === "top") {
        const tampItem = state.collectiondata.filter((item) => item.top);
        state.sortedCollectionData = tampItem;
      }
      if (text === "recent") {
        const tampItem = state.collectiondata.filter((item) => item.recent);
        state.sortedCollectionData = tampItem;
      }
      // state.sortedCollectionData = state.collectiondata;
    },
    collectRankingData: (state, action) => {
      state.rankingData = action.payload;
      state.filteredRankingData = action.payload;
    },
    updateRankingData: (state, action) => {
      const text = action.payload;
      let tempItem = state.rankingData.filter((item) => item.category === text);
      if (text === "All") {
        tempItem = state.rankingData;
      }
      state.filteredRankingData = tempItem;
    },
    updateRankingDataByBlockchain: (state, action) => {
      const text = action.payload;
      let tempItem = state.rankingData.filter(
        (item) => item.blockchain === text
      );
      if (text === "All") {
        tempItem = state.rankingData;
      }
      state.filteredRankingData = tempItem;
    },
    updateRankingDataByPostdate: (state, action) => {
      const text = action.payload;
      let tempItem = state.rankingData.filter((item) => item.postDate === text);
      if (text === "All Time" || text === "Last Year") {
        tempItem = state.rankingData;
      }
      state.filteredRankingData = tempItem;
    },
    updateBuyModalProps: (state, action) => {
      const props = action.payload;
      state.buyModalProps = props;
    },
    updateListModalProps: (state, action) => {
      const props = action.payload;
      state.listModalProps = props;
    },
    updateDelistModalProps: (state, action) => {
      const props = action.payload;
      state.delistModalProps = props;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  openMblMenu,
  closeMblMenu,
  openDropdown,
  closeDropdown,
  walletModalShow,
  walletModalhide,
  listModalShow,
  listModalHide,
  delistModalShow,
  delistModalHide,
  buyModalShow,
  buyModalHide,
  showPropertiesModal,
  closePropertiesModal,
  updateTrendingCategorySorText,
  updateTrendingCategoryItemData,
  updateTrendingCategoryItemByInput,
  collectCollectionData,
  updateCollectionData,
  collectRankingData,
  updateRankingData,
  updateRankingDataByBlockchain,
  updateRankingDataByPostdate,
  updateBuyModalProps,
  updateListModalProps,
  updateDelistModalProps,
} = counterSlice.actions;

export default counterSlice.reducer;
