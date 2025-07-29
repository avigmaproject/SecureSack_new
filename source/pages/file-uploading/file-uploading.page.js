import React, { Component } from "react";
import {
  ImageBackground,
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
} from "react-native";
import { Provider } from "react-native-paper";
import { connect } from "react-redux";
import { NativeBaseProvider } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderButton from "../../components/header-button/header-button.component";
import File from "../../components/file/file.component";
import { getAllFiles } from "../../configuration/api/api.functions";
import FileUploadModal from "../../components/file-upload-modal/file-upload-modal.component";
import Loader from "../../components/loader/loader.component";
import InputTextSearch from "../../components/input-text-search/input-text-search.component";
import { Title } from "react-native-paper";
import Icons from "react-native-vector-icons/MaterialIcons";
import styles from "./file-uploading.style";
class FileUploading extends Component {
  initialState = {
    show: false,
    isLoader: false,
    fileList: [],
    access_token: "",
    edit: false,
    data: "",
    search: "",
  };
  constructor() {
    super();
    this.state = {
      ...this.initialState,
    };
    this.array = [];
  }
  userInfo = null;
  componentDidMount = () => {
    const { navigation } = this.props;
    navigation.addListener("focus", () => {
      this.getFileList();
      this.setState(this.initialState);
    });
  };
  getUserInfo = async () => {
    try {
      const information = await AsyncStorage.getItem("user_info");
      if (information) {
        const parsedInfo = JSON.parse(information);
        this.userInfo = parsedInfo; // 👈 stored in class variable
        console.log("User Info stored in variable:", this.userInfo);
      }
    } catch (error) {
      console.log("Error fetching user info:", error);
    }
  };
  getFileList = async () => {
    // const {access_token} = this.props.userData.userData;
    const information = await AsyncStorage.getItem("user_info");
    if (information) {
      const parsedInfo = JSON.parse(information);
      this.userInfo = parsedInfo; // 👈 stored in class variable
      console.log("User Info stored in variable:", this.userInfo);
    }
    this.setState({
      isLoader: true,
      access_token: this.userInfo?.access_token,
    });
    await getAllFiles(this.userInfo?.access_token)
      .then((response) => {
        this.setState({ fileList: response.data.items, isLoader: false });
        this.array = response.data.items;
      })
      .catch((error) => console.log("File list error: ", error));
  };

  changeModalVisibility = (bool) => {
    this.setState({ show: bool });
  };

  changeVisibility = (bool, item) => {
    this.setState({ show: bool, edit: bool, data: item }, () =>
      console.log("Edit: ", this.state.edit)
    );
  };

  changeEdit = (bool) => {
    this.setState({ edit: bool });
  };

  handleSearch = ({ nativeEvent: { eventCount, target, text } }) => {
    this.setState({ search: text });
    this.searchTitle(text);
  };

  searchTitle = (title) => {
    const newData = this.array.filter((item) => {
      const itemData = `${item.name.toUpperCase()}`;
      const textData = title.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({ fileList: newData });
  };

  render() {
    const { navigation } = this.props;
    const { show, access_token, fileList, edit, data, search } = this.state;
    // console.log("accesss ", this.props.userData.userData.access_token )
    return (
      <Provider>
        <NativeBaseProvider>
          <SafeAreaView style={styles.outerView}>
            <ImageBackground
              source={require("../../assets/jpg-images/Financial-Data-Background/financial-data-background.jpg")}
              style={styles.backgroundImage}
            >
              <View style={styles.titleView}>
                <View style={styles.rowObject}>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icons name="arrow-back" color="white" size={24} />
                  </TouchableOpacity>
                  <Title style={styles.title}>{"Files"}</Title>
                  <View style={styles.icons}>
                    <TouchableOpacity
                      onPress={() => this.setState({ show: true })}
                    >
                      <Icons name={"add"} color={"white"} size={24} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {/* <HeaderButton icon="add" title="Files" navigation={navigation} iconPress={() => this.setState({ show: true })}/> */}

              <View style={styles.outerContainerView}>
                <View style={styles.searchView}>
                  <InputTextSearch
                    placeholder="Search"
                    onChange={this.handleSearch}
                    value={search}
                    onClear={() => {
                      this.setState({ search: "" }, () => {
                        this.getFileList(); // ✅ Fetch all files again after clearing search
                      });
                    }}
                  />
                </View>
                <File
                  navigation={navigation}
                  getFileList={this.getFileList}
                  access_token={this.userInfo?.access_token}
                  fileList={fileList}
                  changeVisibility={this.changeVisibility}
                />
                <FileUploadModal
                  navigation={navigation}
                  show={show}
                  changeModalVisibility={this.changeModalVisibility}
                  refereshList={this.getFileList}
                  access_token={this.userInfo?.access_token}
                  edit={edit}
                  data={data}
                  changeEdit={this.changeEdit}
                />
                <Loader isLoader={this.state.isLoader} />
              </View>
            </ImageBackground>
          </SafeAreaView>
        </NativeBaseProvider>
      </Provider>
    );
  }
}

const mapStateToProps = ({ userData }) => ({
  userData,
});

export default connect(mapStateToProps)(FileUploading);
