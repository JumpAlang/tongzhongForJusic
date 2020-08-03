import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';

import AddTo from './AddTo';

class OperatingBarOfSongList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Row type="flex" align="middle" justify="space-around">
        <Col>
          <Button icon={<CaretRightOutlined />}
            onClick={() => this.props.playSongList(this.props.songs)}
          >
            播放全部
          </Button>
        </Col>
        <Col>
          <AddTo data={this.props.songs} />
        </Col>
      </Row>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    playSongList: (songs) => {
      dispatch({ type: 'NEW_PLAYING_LIST', data: songs });
      dispatch({ type: 'UPDATE_PLAY_INDEX', data: 0 });
    },
  };
}

export default connect(null, mapDispatchToProps)(OperatingBarOfSongList);

{/* <>
  <Button icon={<CaretRightOutlined />}
    onClick={() => this.props.playSongList(this.props.songs)}
  >
    播放全部
        </Button>
  <AddTo data={this.props.songs} />
</> */}