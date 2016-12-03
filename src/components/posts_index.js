import React, { Component} from 'react';
import  {connect} from 'react-redux';
import {fetchPosts} from '../actions/index';
import { Link } from 'react-router';
import PostRow from './post_row';


class PostsIndex extends Component {
	static fetchData({ store }) {
    	return store.dispatch(fetchPosts())
  	}
	componentDidMount() {
		this.props.fetchPosts();
	}
	// renderPosts() {
	// 	const posts = this.props.posts ? this.props.posts: []
	// 	return posts.map((post) => {
	// 		return (
	// 			<li className="list-group-item" key={post.id}>
	// 				<Link to={`posts/${post.id}`}>
	// 					<span className="pull-xs-right">{post.categories}</span>
	// 					<strong>{post.title}</strong>
	// 				</Link>
	// 			</li>
				
	// 		)

	// 	})
	// }

	render() {
		const posts = this.props.posts ? this.props.posts: []
		return (
			<div>
				<div className="text-xs-right">
					<Link to="/posts/new" className="btn btn-primary">Add Post</Link>
				</div>
				<h3>Posts</h3>
				<PostRow posts={posts}/>
			</div>
		)
	}
}
function mapStateToProps(state) {
	return {posts: state.posts.all}
}
export {PostsIndex}
export default connect (mapStateToProps, {fetchPosts}) (PostsIndex);