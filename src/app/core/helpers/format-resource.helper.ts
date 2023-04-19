import * as _ from 'lodash';

export function formatResource(data, id) {
  const currentDatetime = new Date();
  const formattedDate =
    currentDatetime.getDate() +
    '-' +
    (currentDatetime.getMonth() + 1) +
    '-' +
    currentDatetime.getFullYear();
  return {
    created: formattedDate,
    lastUpdated: formattedDate,
    name: data.name,
    href: '/api/documents/' + id,
    id: id,
    displayName: data.name,
    url: data.url ? data.url : '',
    external: data.external ? true : false,
    attachment: data.attachment ? true : false,
    userGroupAccesses: [],
    attributeValues: [],
    translations: [],
    userAccesses: []
  };
}
