import { Component, OnInit } from '@angular/core';
import { gqlResult } from '../../shared/gql';
import { ReadGql } from '../../shared/readGqlResult';
import { UIToolsService } from '../common/UIToolsService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private ui: UIToolsService) { }
  searchTerm = '';
  cursor = '';
  data = '';
  d?: gqlResult;
  ngOnInit() {
  }
  dataChange() {
    this.d = JSON.parse(this.data) as gqlResult;
  }
  searchTermChange() {
    this.cursor = '';
  }
  getGraphQl() {
    return `#graphql
query searchGroups {
  keywordSearch(
    input: {first: 200
     ${this.cursor ? `after:"${this.cursor}"` : ''}
    }
    filter: {query: "${this.searchTerm}", lat: 51.5072, lon: 0.1276, radius: 20000, source: GROUPS}
  ) {
    count
    pageInfo {
      endCursor
    }
    edges {
      node {
        id
       result{
        ... on Group{
          id
          name,
          link
          city
          state
          country
          foundedDate
          description
          latitude
          longitude
          stats{
            memberCounts{
              all
            }
         }
          topics{
            id
            name
          }
          topicCategory{
            id
            name
          }
          pastEvents(input: {last: 20}) {
      edges {
        node {
          id
          title
          dateTime
          eventType
          going
          description
          shortDescription
          shortUrl
        }
      }
    }
    upcomingEvents(input: {first: 20}) {
      edges {
        node {
          id
          title
          dateTime
          eventType
          going
          description
          shortDescription
          shortUrl
        }
      }
    }
    
          unifiedEvents{
            edges{
              node{
                id
                title
                dateTime
                eventType
                going
                description
                shortDescription
                shortUrl
              }
            }
          }
        }
      }
      }
    }
  }
}

`
  }
  loadData() {
    if (this.d) {
      ReadGql.readGqlResult(this.d, this.searchTerm).then(x => {
        this.ui.info("Loaded " + this.searchTerm + " - " + x)
      })
      this.cursor = this.d.data.keywordSearch.pageInfo.endCursor;
      this.data = '';
      this.d = undefined;

    }
  }
}

