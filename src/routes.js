import React from 'react';
import { Router, Route, IndexRoute} from 'react-router';

import App from './components/app';
import PostsIndex from './components/posts_index';
import PostsNew from './components/posts_new';
import PostsShow from './components/posts_show';
import Animation from './components/animation';

export default function(history){
	return (
		<Router history={history}>
			<Route path="/" component={App} >
				<IndexRoute component={PostsIndex} />
				<Route path="posts/new" component={PostsNew} />
				<Route path="posts/:id" component={PostsShow} />
				<Route path="animation" component={Animation} />
			</Route>
		</Router>
	)
}
