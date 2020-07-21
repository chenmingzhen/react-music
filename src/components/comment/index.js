import React, { createElement } from "react";
import { Pagination } from "antd";
import { getListComment, likeComment } from "../../api/playlist";
import { Comment as AntComment, Avatar, message } from "antd";
import "./_style.scss";
import { timestampToTime } from "../../util/util";
import { LikeOutlined, LikeFilled } from "@ant-design/icons";

class Comment extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      commentData: [],
      offset: 0,
    };
  }

  getComment(offset) {
    getListComment(this.props.listId, offset).then((data) => {
      this.setState({ commentData: data });
    });
  }

  componentDidMount() {
    this.getComment(this.state.offset * 20);
  }

  likeOrDislikeComment(item, commentId) {
    let t = 0;
    if (item.liked === false) {
      t = 1;
    }
    likeComment(this.props.listId, commentId, t, 2).then((data) => {
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

export default Comment;
