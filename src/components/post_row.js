import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class PostRow extends Component {
  render() {
    return (
      <ul className="list-group">
        {
          this.props.posts.map((p)=> {
            let id = p.id
            return (
              <li className="list-group-item" key={p.id}>
                <Link to={`/posts/${p.id}`}>
                  <span className="pull-xs-right">{p.categories}</span>
                  <strong>{p.title}</strong>
                </Link>
              </li>
            )
          })
        }
      </ul>
    )
  }
}

PostRow.propTypes = {
  posts: PropTypes.instanceOf(Array).isRequired
}

export default PostRow
