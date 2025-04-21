import React, {Component} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  FlatList,
  ToastAndroid,
  SafeAreaView,
} from 'react-native';
import FormData from 'form-data';
import {Toast, Root} from 'native-base';
// import DocumentPicker from 'react-native-document-picker';
import Icons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {Chip} from 'react-native-paper';
import qs from 'qs';

import {
  addTag,
  uploadFile,
  getAllFiles,
  updateTagImage,
  updateFileParams,
} from '../../configuration/api/api.functions';
import Button from '../../components/button/button.component';
import InputTextDynamic from '../../components/input-text-dynamic/input-text-dynamic.component';
import {Color} from '../../assets/color/color';

import FileSelected from '../file-selected/file-selected.component';

import styles from './file-upload-modal.style';

class FileUploadModal extends Component {
  initialState = {
    fileList: '',
    countList: '',
    fileListData: [],
    uploadFileData: null,
    tagList: [],
    tagCat: '',
    singleFile: null,
  };
  constructor() {
    super();
    this.state = {
      ...this.initialState,
    };
  }

  componentDidMount() {
    const {data, navigation} = this.props;
    this.setState(this.initialState);
  }
 
  // uploadFile = async () => {
  //   try {
  //     const results = await DocumentPicker.pick({
  //       type: [DocumentPicker.types.allFiles],
  //     });
  //     // const data = results[0].name;
  //     console.log('SSSS+++++,  ', results);
  //     this.setState({
  //       fileList: results.name,
  //       countList: this.state.countList + 1,
  //     });
  //     var filedata = {
  //       doc: results.name,
  //       id: this.state.countList,
  //     };
  //     let data = new FormData();
  //     data.append('', results.uri);
  //     this.state.fileListData.push(filedata);
  //     this.uploadFileApi(data, results.name);
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //     } else {
  //       throw err;
  //     }
  //   }
  // };

  showToast = (message) => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );
  };

  uploadFileApi = async (data, name) => {
    this.setState({isLoader: true});
    const {access_token} = this.props;
    console.log('Responseing: ', access_token);
    try {
      await uploadFile(access_token, data, name)
        .then((response) => {
          console.log('Response: ', response);
          if (response.success) {
            this.setState({
              fileid: response.details.id,
              isLoader: false,
              isOpen: true,
              uploadDT: response.details.uploadDtm,
              fileSize: response.details.size,
            });
            this.showToast('File uploaded successfully');
          } else {
            this.showToast('File uploading failed');
          }
        })
        .catch((error) => {
          console.log('Error: ', JSON.stringify(error.response));
          this.setState({isLoader: false});
          alert(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  updateTags = async (item) => {
    this.setState({isLoader: true});
    const {access_token} = this.props;
    const fileid = this.state.fileid;
    let updateTagsList = [];
    updateTagsList.push(item.item);

    const data = qs.stringify({
      tags: `${updateTagsList}`,
    });
  };

  addTags = async () => {
    this.setState({isLoader: true});
    const {access_token, edit, data} = this.props;
    console.log('ID: ', access_token);
    if (this.state.tagCat.length > 0) {
      if (edit) {
        console.log('Check true');
        try {
          const tags = qs.stringify({tags: this.state.tagCat});
          await updateFileParams(access_token, tags, data.item.id).then(
            (response) => {
              if (response.status === 'Success') {
                this.showToast('Tag added  successfully');
                this.state.tagList.push(this.state.tagCat);
                this.setState({isLoader: false, tagCat: ''});
              } else {
                this.showToast('Failed');
                this.setState({isLoader: false});
              }
            },
          );
        } catch (error) {
          console.log('Edit', error);
          this.showToast('Something went wrong');
          this.setState({isLoader: false});
          console.log('Error: ', error);
        }
      } else {
        console.log('Check false');
        try {
          const tags = qs.stringify({tag: this.state.tagCat});
          await addTag(access_token, tags)
            .then((response) => {
              console.log('Res: ', response);
              if (response.status === 'Success') {
                this.showToast('Tag added  successfully');
                this.state.tagList.push(this.state.tagCat);
                this.setState({isLoader: false, tagCat: ''});
              } else {
                this.showToast('Failed');
                this.setState({isLoader: false});
              }
            })
            .catch((error) => {
              this.showToast('Something went wrong');
              this.setState({isLoader: false});
              console.log('Error: ', error);
            });
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      this.showToast('Please fill the Input text');
    }
  };

  renderUploaTags = (item) => (
    <View style={styles.tagList}>
      <Chip onPress={() => this.updateTags(item)}>{item.item}</Chip>
    </View>
  );

  closeModal = () => {
    const {changeModalVisibility, changeEdit} = this.props;
    this.state.tagList.length = 0;
    this.state.fileListData.length = 0;
    this.setState(this.initialState, () => console.log('state', this.state));
    changeModalVisibility(false);
    changeEdit(false);
    this.props.refereshList();
  };

  listEmptyView = () => (
    <View>
      {!this.props.edit ? (
        <View style={styles.buttonContainer}>
          <Button onPress={() => this.uploadFile()} title="Upload File" />
        </View>
      ) : (
        this.listFilledView(this.state.fileListData)
      )}
    </View>
  );

  listFilledView = (fileListData) => (
    <View>
      <FileSelected fileList={fileListData} />
      <Text style={styles.fileView}>Tags</Text>
      <View style={styles.flistTags}>
        <FlatList
          data={this.state.tagList}
          numColumns={5}
          renderItem={(item, id) => this.renderUploaTags(item)}
        />
      </View>
      <View style={styles.row}>
        <View style={{width: '90%', padding: 10}}>
          <InputTextDynamic
            value={this.state.tagCat}
            onChangeText={(tagCat) => {
              this.setState({tagCat});
            }}
            placeholder="Add Tag"
            color={Color.orange}
          />
        </View>
        <TouchableOpacity
          onPress={() => this.addTags()}
          style={{alignItems: 'center', justifyContent: 'center'}}>
          <SimpleLineIcons name="plus" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );

  render() {
    const {show} = this.props;
    const {fileListData} = this.state;
    console.log('Edit: ', this.props);
    return (
      <Modal transparent={false} animationType={'fade'} visible={show}>
        <SafeAreaView>
          <TouchableOpacity
            style={styles.closeModal}
            onPress={() => this.closeModal()}>
            <Icons name="close" color="#000000" size={25} />
          </TouchableOpacity>
          {fileListData.length === 0
            ? this.listEmptyView()
            : this.listFilledView(fileListData)}
        </SafeAreaView>
      </Modal>
    );
  }
}

export default FileUploadModal;
