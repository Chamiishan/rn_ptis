import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { addImg, remImg, uploadImg, addImgFrmProp, remServerImg } from '../actions';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { AsyncImage } from '../common/AsyncImage';
import { getCompressImage } from './ImageCompressionModule';

// import { AsyncImage } from '../common';

class ImageSelectView extends React.Component {

    constructor(props) {
        super(props);
    }

    chooseImage() {
        const options = {
            title: 'Select Image',

            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.showImagePicker(options, response => {
            if (response.fileName !== undefined) {

                getCompressImage(response.fileName, response.path, (object) => {
                    console.log("compressed img ", object);
                    this.props.addImg(
                        {
                            uri: response.uri,
                            key: -1,
                            path: object,
                            fileName: response.fileName,
                            upload_status: "not_uploaded"
                        }
                    )
                }
                );

            }
        });

        // if (this.state.filePath != null) {
        // }
    }

    removeImage(img) {
        this.props.remImg(img);
    }

    uploadImg(img) {
        console.log("upload img: ", img);
        this.props.uploadImg(img);
    }

    getImageViewsFrmServer() {
        if (this.props.property && this.props.property.images != null && this.props.property.images.length > 0) {
            const images = this.props.property.images.split(",");

            const url = "http://13.235.156.167:1025/loginws/rest/property_detail/fetchPropImage?filename=";
            if (images !== null && images.length > 0) {
                return (
                    images.map((img, index) => (
                        <View key={index} style={styles.imgViewStyle}>
                            <TouchableOpacity onPress={() => Actions.view_image({ uri: (url + img.trim()) })}>
                                <AsyncImage style={styles.imgStyle} placeholderColor={require('../Component/assets/home_1.png')}
                                    source={{ uri: (url + img.trim()) }} />
                                {/* <Image style={styles.imgStyle} source={{ uri: "http://13.235.156.167:1025/loginws/rest/property_detail/fetchPropImage?filename=1533021688287.jpg" }}/>  */}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.touchStyle}
                                onPress={() => this.props.remServerImg(img)} >
                                <Text style={styles.btnStyle}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                );
            }
        }
    }

    getImageViews() {

        if (this.props.imgArr) {
            return (
                this.props.imgArr.map((img, index) => (
                    <View key={index} style={styles.imgViewStyle}>
                        <TouchableOpacity onPress={() => Actions.view_image({ uri: img.uri })}>
                            <Image style={styles.imgStyle} source={{ uri: img.uri }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.touchStyle}
                            onPress={img.upload_status === "uploaded" ? () => this.removeImage(img) : () => this.uploadImg(img)}>
                            <Text style={styles.btnStyle} >
                                {img.upload_status === "uploaded" ? "Delete" : "Upload"}
                            </Text>
                        </TouchableOpacity>
                        {this.getCancelButton(img)}
                        <ActivityIndicator
                            style={img.upload_status === "uploading" ? styles.upProgStyle : styles.upInProgrStyle} size={'small'} />
                    </View>
                )
                )
            );
        }
    }

    getCancelButton(img) {
        return (
            <TouchableOpacity style={img.upload_status === "uploaded" ? styles.touchStyleInvisible : styles.touchStyle} onPress={() => this.removeImage(img)}>
                <Text style={styles.btnStyle}>
                    Cancel
                </Text>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={styles.containerStyle} >
                <Text style={styles.textStyle}>Property Images</Text>
                <View style={styles.viewStyle}>
                    <TouchableOpacity style={styles.touchStyle} onPress={() => this.chooseImage()}>
                        <Text style={styles.btnStyle}>
                            Choose Image Files
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.imgContainer}>
                        {this.getImageViewsFrmServer()}
                        {this.getImageViews()}
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        flexDirection: "row",
        backgroundColor: '#fff',
        width: null,
        flex: 1,
        padding: 10
    },
    viewStyle: {
        width: null,
        flex: 0.7,
        paddingLeft: 5
    },
    textStyle: {
        width: null,
        flex: 0.3
    },
    touchStyle: {
        alignItems: "baseline"
    },
    touchStyleInvisible: {
        alignItems: "baseline",
        display: "none"
    },
    btnStyle: {
        padding: 6,
        margin: 6,
        marginLeft: 8,
        minWidth: 60,
        textAlign: "center",
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#007aaf',
        color: '#007aaf'
    },
    upProgStyle: {
        marginLeft: 5
    },
    upInProgrStyle: {
        marginLeft: 5,
        display: "none"
    },
    imgContainer: {
        flexDirection: 'column',
        flex: 1
    },
    imgViewStyle: {
        flexDirection: 'row'
    },
    imgStyle: {
        margin: 8,
        width: 30,
        height: 30
    }

});

const mapStateToProps = (state) => {
    return {
        imgArr: state.prop.imgArr,
        uploaded_img: state.prop.uploaded_img
    }
}

export default connect(mapStateToProps, { addImg, remImg, uploadImg, addImgFrmProp, remServerImg })(ImageSelectView);