import React from 'react';
import { View, Image } from 'react-native';

class AsyncImage extends React.Component {
    //constructor to declare state and get props from parent
    constructor(props) {
        super(props)
        this.state = { loaded: false }
    }

    render() {
        //extracting properties from props
        const {
            placeholderColor,
            style,
            source
        } = this.props
        return (
            <View
                style={style}>
                <Image
                    source={source}
                    resizeMode={'cover'}
                    style={[
                        {
                            position: 'absolute',
                            resizeMode: 'cover'
                        },
                        style
                    ]}
                    onLoad={this._onLoad}  //function which will call after image loads completely
                />
                {/* //render place holder until and unless image loading state changes. */}
                {!this.state.loaded &&
                    <Image source={placeholderColor} style={style} />
                }
            </View>
        )
    }
    //Function to set state for image loading status.
    _onLoad = () => {
        this.setState(() => ({ loaded: true }))
    }
}

export { AsyncImage };