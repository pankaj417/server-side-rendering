import Express from 'express'
import path from 'path'

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { useRouterHistory, RouterContext, match } from 'react-router'

import { createMemoryHistory, useQueries } from 'history'
import compression from 'compression'
import Promise from 'bluebird'

import configureStore from '../store/configureStore'
import createRoutes from '../routes'

import { Provider } from 'react-redux'

import Helmet from 'react-helmet'

let server = new Express()
let port = process.env.PORT || 4000
process.env.ON_SERVER = true

let styleSrc
const scriptSrcs = [
     'http://localhost:5000/bundle.js'
  ]
styleSrc = 'http://localhost:5000/style.css'
// server.use(compression())

// if (process.env.NODE_ENV === 'production') {
//   server.use(Express.static(path.join(__dirname, '../..', 'public')))
// } else {
//   server.use('/assets', Express.static(path.join(__dirname, '..', 'assets')))
//   server.use(Express.static(path.join(__dirname, '../..', 'dist')))
// }

server.use('/assets', Express.static(path.join(__dirname, '..', 'assets')))
server.use(Express.static(path.join(__dirname, '../..', 'dist')))

server.set('views', path.join(__dirname, 'views'))
server.set('view engine', 'ejs')

server.get('*', (req, res, next)=> {
  let history = useRouterHistory(useQueries(createMemoryHistory))()
  let store = configureStore()
  let routes = createRoutes(history)
  let location = history.createLocation(req.url)
  match({ routes, location }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(301, redirectLocation.pathname + redirectLocation.search)
    } else if (error) {
      res.status(500).send(error.message)
    } else if (renderProps == null) {
      res.status(404).send('Not found')
    } else {
      let [ getCurrentUrl, unsubscribe ] = subscribeUrl()
      let reqUrl = location.pathname + location.search

      getReduxPromise().then(()=> {
        let reduxState = escape(JSON.stringify(store.getState()))
        let html = ReactDOMServer.renderToString(
          <Provider store={store}>
            { <RouterContext {...renderProps}/> }
          </Provider>
        )
        let metaHeader = Helmet.rewind();

        if ( getCurrentUrl() === reqUrl ) {
          res.render('index', { metaHeader, html, scriptSrcs, reduxState, styleSrc })
        } else {
          res.redirect(302, getCurrentUrl())
        }
        unsubscribe()
      })
      .catch((err)=> {
        Helmet.rewind();
        unsubscribe()
        next(err)
      })
      function getReduxPromise () {
        
        let { query, params } = renderProps
        let comp = renderProps.components[renderProps.components.length - 1].WrappedComponent

        let promise =  comp && comp.fetchData ?
          comp.fetchData({ query, params, store, history }) :
          Promise.resolve()

        return promise
      }
    }
  })
  function subscribeUrl () {
    let currentUrl = location.pathname + location.search
    let unsubscribe = history.listen((newLoc)=> {
      if (newLoc.action === 'PUSH' || newLoc.action === 'REPLACE') {
        currentUrl = newLoc.pathname + newLoc.search
      }
    })
    return [
      ()=> currentUrl,
      unsubscribe
    ]
  }
})
server.use((err, req, res, next)=> {
  console.log(err.stack)
  // TODO report error here or do some further handlings
  res.status(500).send("something went wrong...")
})

console.log(`Server is listening to port: ${port}`)
server.listen(port)
