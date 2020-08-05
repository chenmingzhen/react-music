import React, { createElement } from "react";
import { Avatar, Comment as AntComment, message, Pagination } from "antd";
import { getListComment, likeComment } from "../../api/playlist";
import "./_style.scss";
import { timestampToTime } from "../../util/util";
import { LikeFilled, LikeOutlined } from "@ant-design/icons";
import { getAlbumComment } from "../../api/album";
import { getMvComment } from "../../api/mv";
import { getSongComment } from "../../api/singer";

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commentData: [],
      offset: 0,
    };
  }

  getComment(offset) {
    if (this.props.isList === 1) {
      getListComment(this.props.listId, offset).then((data) => {
        this.setState({ commentData: data });
      });
    } else if (this.props.isList === 2) {
      getAlbumComment(this.props.listId, offset).then((data) => {
        this.setState({ commentData: data });
      });
    } else if (this.props.isList === 3) {
      getMvComment(this.props.listId, offset).then((data) => {
        this.setState({ commentData: data });
      });
    } else {
      getSongComment(this.props.listId, offset).then((data) => {
        this.setState({ commentData: data });
      });
    }
  }

  //歌曲评论 兼容上下曲更新
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (this.props.listId !== nextProps.listId) {
      setTimeout(() => {
        if (nextProps.isList === 4) {
          getSongComment(this.props.listId, 0).then((data) => {
            this.setState({ commentData: data, offset: 0 });
          });
        }
        if (nextProps.isList === 1) {
          getListComment(this.props.listId, 0).then((data) => {
            this.setState({ commentData: data, offset: 0 });
          });
        }
        if (nextProps.isList === 2) {
          getAlbumComment(this.props.listId, 0).then((data) => {
            this.setState({ commentData: data, offset: 0 });
          });
        }
        if (nextProps.isList === 3) {
          getMvComment(this.props.listId, 0).then((data) => {
            this.setState({ commentData: data, offset: 0 });
          });
        }
      });
    }
    return true;
  }

  componentDidMount() {
    this.getComment(this.state.offset * 20);
  }

  likeOrDislikeComment(item, commentId) {
    let t = 0;
    if (item.liked === false) {
      t = 1;
    }
    let type = 2;
    if (this.props.isList === 2) {
      type = 3;
    }
    if (this.props.isList === 3) {
      type = 1;
    }
    if (this.props.isList === 4) {
      type = 0;
    }
    likeComment(this.props.listId, commentId, t, type).then((data) => {
      if (data.code === 200) {
        message.success("操作成功");
        this.getComment(this.state.offset);
      }
    });
  }

  renderHotComments(comments, title) {
    if (comments && comments.length > 0)
      return (
        <>
          <div className={"new-comment"}>{title}</div>
          <div>
            {comments.map((item, index) => {
              return (
                <AntComment
                  key={index}
                  actions={[
                    <span
                      onClick={() => {
                        this.likeOrDislikeComment(item, item.commentId);
                      }}
                    >
                      {createElement(
                        item.liked === true ? LikeFilled : LikeOutlined
                      )}
                      <span className="comment-action">{item.likedCount}</span>
                    </span>,
                  ]}
                  author={<a href={"none"}>{item.user.nickname}</a>}
                  avatar={
                    <Avatar
                      src={item.user.avatarUrl}
                      alt={item.user.nickname}
                    />
                  }
                  content={<p>{item.content}</p>}
                  datetime={timestampToTime(item.time, true)}
                />
              );
            })}
          </div>
        </>
      );
  }

  renderPagination() {
    const { commentData } = this.state;
    if (commentData.comments && commentData.comments.length > 0) {
      return (
        <>
          {
            <Pagination
              defaultCurrent={this.state.offset + 1}
              pageSize={20}
              showSizeChanger={false}
              total={commentData.total}
              onChange={(page) => {
                this.setState({ offset: page - 1 });
                this.getComment((page - 1) * 20);
              }}
            />
          }
        </>
      );
    }
  }

  render() {
    const { commentData, offset } = this.state;
    return (
      <div className={"comment-wrapper"}>
        {offset === 0 &&
          this.renderHotComments(commentData.hotComments, "精选评论")}
        {this.renderHotComments(commentData.comments, "最新评论")}
        {this.renderPagination()}
        {commentData.comments && commentData.comments.length === 0 ? (
          <div>暂无评论</div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

Comment.defaultProps = {
  isList: 1,
};

export default Comment;
