import { NativeModules } from 'react-native';

export const getCompressImage = (filename, orgImgPath, calllback) => {
    NativeModules.ImageCompressionModule.getCompressImage(filename, orgImgPath, calllback);
}

// module.exports = NativeModules.ImageCompressionModule;