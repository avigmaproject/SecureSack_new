import React, {Component} from 'react';
import {View, FlatList, PermissionsAndroid} from 'react-native';
import RNFetchBlob from "rn-fetch-blob";
import qs from 'qs';
import {Toast} from 'native-base';

import BlockFile from '../block-file/block-file.component'
import {deleteFile, downloadFile} from '../../configuration/api/api.functions'
import Loader from '../loader/loader.component';

import styles from './file.style';

class File extends Component {
  constructor() {
    super();
    this.state = {
      show: false,
      isLoader: false
    };
  }

onDownload = async (item) => {
  try {
      this.setState({isLoader: true});
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const { config, fs } = RNFetchBlob;
        //let PictureDir = fs.dirs.PictureDir // this is the pictures directory. You can check the available directories in the wiki.
        let PictureDir = fs.dirs.DownloadDir;
        let options = {
          fileCache: true,
          addAndroidDownloads: {
            useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
            notification: true,
            path: PictureDir + "/Secure Sack/" +item.item.name, // this is the path where your downloaded file will live in
            description: "Downloading file.",
          },
        };
        // config(options).fetch('GET', "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf").then((res) => {    console.log('download',res)
        config(options)
          .fetch("GET", `https://app.securesack.com/files/${item.item.id}?ac=${this.props.access_token}`, {
              'Content-Type': 'multipart/form-data', 
              'Content-Size': item.item.size, 
              'Content-Disposition': 'attatchment; filename={' + item.item.name + '}',
              'Cache-Control': 'no-store' 
            
          })
          .then((res) => {
            console.log("download", res);
            this.setState({isLoader: false});
            this.showToast('Downloaded Successfully', 'success', true)
          });
      } else {
            this.setState({isLoader: false});
            this.showToast('Need permission for downloading file', 'warning', true)
      }
    } catch (err) {
      console.log(err);
            this.setState({isLoader: false});
    }
}

onEdit = (item) => {
  const {changeVisibility} = this.props;
  console.log("Change: ", this.props)
  changeVisibility(true, item);
}

onDelete = async (item) => {
  this.setState({ isLoader: true })
  const {access_token} = this.props;
  await deleteFile(item.item.id, access_token)
  .then(response => {
    this.showToast('File Deleted', 'danger', false)
  this.setState({ isLoader: false })
    this.props.getFileList()
  }).catch(error => {
    console.log("Error in delete file: ", error)
  })
}

  showToast = (message, type, isButtonText) => {
    Toast.show({
      text: message,
      type: `${type}`,
      position: 'bottom',
      textStyle: styles.toastText,
      buttonText: isButtonText ? 'DISMISS' : 'OK',
      duration: 7000,
    });
  };

  render() {
    const {navigation, fileList} = this.props;
    const {isLoader} = this.state;
    console.log("File list ", fileList )
    return (
      <View style={styles.container}>
        <FlatList
          data={fileList}
          numColumns={2}
          renderItem={(item, id) => <BlockFile item={item} onInfo={this.onInfo} onDelete={this.onDelete} onEdit={this.onEdit} onDownload={this.onDownload}/>}
        />
        <Loader isLoader={this.state.isLoader} />
      </View>
    );
  }
}

export default File;
