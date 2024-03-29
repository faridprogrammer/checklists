import React, { useState } from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import globals from "../globals"
import SearchBar from '../components/search';
import { useFlexSearch } from 'react-use-flexsearch';

const ChecklistsIndex = ({ data, location }) => {
  const isBrowser = typeof window !== "undefined";
  const unFlattenResults = results =>
    results.map(post => {
      const { date, slug, tags, title } = post;
      return { slug, title, date, tags };
    });


  const siteTitle = data.site.siteMetadata?.title || `Title`
  const isDemo = data.site.siteMetadata?.demo || false
  let posts = data.allChecklistsJson.nodes
  const index = data.localSearchChecklists.index;
  const store = data.localSearchChecklists.store;
  const { search } = isBrowser ? window.location : '';
  const query = new URLSearchParams(search).get('s')
  const [searchQuery, setSearchQuery] = useState(query || '');

  globals.resetBackgroundColor();

  const results = useFlexSearch(searchQuery, index, store);
  posts = searchQuery ? unFlattenResults(results) : posts;

  const demoSign = (
    <a class="github-fork-ribbon" href="https://github.com/faridprogrammer/checklists" data-ribbon="Fork me on GitHub" title="Fork me on GitHub">Fork me on GitHub</a>);
  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        {isDemo && demoSign}
        <Seo title="All" />
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <h4>
          No check lists found.
        </h4>
      </Layout>
    )
  }
  return (
    <Layout location={location} title={siteTitle}>
      {isDemo && demoSign}
      <Seo title="All" />
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      {posts.map(post => {
        const title = post.title || post.slug;
        post.tags.sort();
        return (
          <Link to={post.slug} itemProp="url" class="checklist-poster">
            <div class="flex-container" style={{ 'margin-bottom': '10px' }}>
              <div className="tag-container">
                {post.tags.map(tag => { return (<div style={{ 'background-color': globals.getTagColor(tag) }} className={`tag`}></div>) })}
              </div>
              <div className="checklist-title long-and-truncated">{title}</div>
            </div>
          </Link>
        )
      })}
    </Layout>
  )
}

export default ChecklistsIndex

export const pageQuery = graphql`
  query {
    localSearchChecklists {
      index
      store
    }
    site {
      siteMetadata {
        title
        demo
      }
    }
    allChecklistsJson(sort: {fields: date, order: DESC}, limit: 1000) {
      nodes {
        description
        id
        date(formatString: "MMMM DD, YYYY")
        tags
        title
        source
        abstract
        slug
      }
    }
  }
`
