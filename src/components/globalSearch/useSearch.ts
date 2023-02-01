import SearchBarCreator from './SearchBar'
const searchBar = new SearchBarCreator()

function openSearchBar() {
  searchBar.present()
}
function closeSearchBar() {
  searchBar.dismiss()
}

export default {
  openSearchBar,
  closeSearchBar
}