import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,

} from 'react-native';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';

import {TextInput} from 'react-native-paper';

import styles from './auto-complete.style.js';

// const ViewPropTypes = RNViewPropTypes || View.propTypes;

class Autocomplete extends Component {
  static propTypes = {
    ...TextInput.propTypes,
    containerStyle: ViewPropTypes.style,
    inputContainerStyle: ViewPropTypes.style,
    
    data: PropTypes.array,
    hideResults: PropTypes.bool,
    keyboardShouldPersistTaps: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]),
    listContainerStyle: ViewPropTypes.style,
    listStyle: ViewPropTypes.style,
    onShowResults: PropTypes.func,
    onStartShouldSetResponderCapture: PropTypes.func,
    renderItem: PropTypes.func,
    keyExtractor: PropTypes.func,
    renderSeparator: PropTypes.func,
    renderTextInput: PropTypes.func,
    flatListProps: PropTypes.object,
  };

  static defaultProps = {
    data: [],
    keyboardShouldPersistTaps: 'always',
    onStartShouldSetResponderCapture: () => false,
    renderItem: ({item}) => <Text>{item}</Text>,
    renderSeparator: null,
    renderTextInput: (props) => <TextInput {...props} />,
    flatListProps: {},
  };

  constructor(props) {
    super(props);
    this.resultList = null;
    this.textInput = null;

    this.onRefListView = this.onRefListView.bind(this);
    this.onRefTextInput = this.onRefTextInput.bind(this);
    this.onEndEditing = this.onEndEditing.bind(this);
  }

  onEndEditing(e) {
    this.props.onEndEditing && this.props.onEndEditing(e);
  }

  onRefListView(resultList) {
    this.resultList = resultList;
  }

  onRefTextInput(textInput) {
    this.textInput = textInput;
  }
  blur() {
    const {textInput} = this;
    textInput && textInput.blur();
  }
  focus() {
    const {textInput} = this;
    textInput && textInput.focus();
  }
  isFocused() {
    const {textInput} = this;
    return textInput && textInput.isFocused();
  }

  renderResultList() {
    const {
      data,
      listStyle,
      renderItem,
      keyExtractor,
      renderSeparator,
      keyboardShouldPersistTaps,
      flatListProps,
      onEndReached,
      onEndReachedThreshold,
      disable,
      maxRender,
    } = this.props;
    return (
      !disable && (
        <FlatList
          ref={this.onRefListView}
          data={data}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          renderSeparator={renderSeparator}
          onEndReached={onEndReached}
          onEndReachedThreshold={onEndReachedThreshold}
          style={[styles.list, listStyle]}
          {...flatListProps}
        />
      )
    );
  }

  renderTextInput() {
    const {renderTextInput, style} = this.props;
    const props = {
      style: [styles.input, style],
      ref: this.onRefTextInput,
      onEndEditing: this.onEndEditing,
      ...this.props,
    };

    return renderTextInput(props);
  }

  render() {
    const {
      data,
      containerStyle,
      hideResults,
      inputContainerStyle,
      listContainerStyle,
      onShowResults,
      onStartShouldSetResponderCapture,
      disable,
      value,
    } = this.props;
    const showResults = data.length > 0;

    // Notify listener if the suggestion will be shown.
    onShowResults && onShowResults(showResults);

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={[styles.inputContainer, inputContainerStyle]}>
          {this.renderTextInput()}
        </View>
        {!hideResults && (
          <View
            style={listContainerStyle}
            onStartShouldSetResponderCapture={onStartShouldSetResponderCapture}>
            {showResults && this.renderResultList()}
          </View>
        )}
      </View>
    );
  }
}

export default Autocomplete;
