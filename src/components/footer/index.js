import React from 'react'
// import { withRouter } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import FolderIcon from '@mui/icons-material/Folder';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer = () => {

    // const [value, setValue] = useState('recents');

  const handleChange = () => {
    // setValue(newValue);
  };

    return (
        <BottomNavigation sx={{ width: 500 }} 
        // value={value} 
        onChange={handleChange}>
      <BottomNavigationAction
        label="Recents"
        value="recents"
        icon={<RestoreIcon />}
      />
      <BottomNavigationAction
        label="Favorites"
        value="favorites"
        icon={<FavoriteIcon />}
      />
      <BottomNavigationAction
        label="Nearby"
        value="nearby"
        icon={<LocationOnIcon />}
      />
      <BottomNavigationAction label="Folder" value="folder" icon={<FolderIcon />} />
    </BottomNavigation>
    )
}

// export default withRouter(Footer)
export default Footer