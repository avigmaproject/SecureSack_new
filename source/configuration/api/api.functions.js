import axios from 'axios';
import {connect} from 'react-redux';

import {BASE_URL} from './api.types';

export const createOrUpdateRecord = async (
  datatype,
  recid,
  payload,
  access_token,
) => {
  return axios(`${BASE_URL}/data/${datatype}/${recid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + access_token,
    },
    data: payload,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const lookupType = async (access_token, lookupType) => {
  return axios(`${BASE_URL}/actions/lookup/${lookupType}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ` + access_token,
    },
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const viewRecords = async (datatype, recid, access_token) => {
  console.log('View Rec: ', datatype, recid, access_token);
  return axios(`${BASE_URL}/data/${datatype}/${recid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + access_token,
    },
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const deleteRecords = async (datatype, recid, access_token) => {
  return axios(`${BASE_URL}/data/${datatype}/${recid}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + access_token,
    },
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const archiveRecords = async (
  datatype,
  recid,
  access_token,
  payload,
) => {
  return axios(`${BASE_URL}/data/${datatype}/${recid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + access_token,
    },
    data: payload,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const addBusinessEntity = async (access_token, payload) => {
  return axios(`${BASE_URL}/data/RefBusinessEntity/__NEW__`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + access_token,
    },
    data: payload,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const search = async (access_token, term) => {
  return axios(`${BASE_URL}/actions/lookup/records`, {
    method: 'GET',
    params: {
      term: term,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + access_token,
    },
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const changePassword = async (access_token, data) => {
  return axios(`${BASE_URL}/actions/accountprofile/changePassword`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + access_token,
    },
    data,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const addTag = async (access_token, tags) => {
  return axios(`${BASE_URL}/actions/tags/addTag`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + access_token,
    },
    data: tags,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const uploadFile = async (access_token, data, name) => {
  return axios(`${BASE_URL}/files/__NEW__`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + access_token,
      "X-File-Name": name
    },
    data
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const resetPasswordStepOne = async (data) => {
  console.log(data, 'email');
  return axios(`${BASE_URL}/actions/resetPassword/startReset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const updateTagImage = async (fileid, access_token, tags) => {
  console.log(fileid, 'id file', tags);
  return axios(`${BASE_URL}/files/${fileid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + access_token,
    },
    data: tags,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const updateFileParams = async (access_token, tags, fileid) => {
  console.log(access_token, tags, fileid)
  return axios(`${BASE_URL}/files/${fileid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + access_token,
    },
    data: tags
  })
  .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

export const getAllFiles = async (access_token) => {
  return axios(`${BASE_URL}/files/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + access_token,
    },
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const deleteFile = async (fileid, access_token) => {
  return axios(`${BASE_URL}/files/${fileid}`, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + access_token,
    },
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const downloadFile = async (fileid, access_token, size, filename) => {
  console.log(fileid, access_token, size, filename)
  return axios(`${BASE_URL}/files/${fileid}`,{
    method: 'POST',
    params: {
      ac: access_token
    },
    headers: {
    'Content-Type': 'multipart/form-data',
    'Content-Size': size, 
    'Content-Disposition': 'attatchment; filename={' + filename + '}',
    }
  }).then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

export const createNewKey = async (access_token, data) => {
  return axios(`${BASE_URL}/actions/sharing/keys/__NEW__`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + access_token,
    },
    data
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

export const updateKey = async (access_token, keyId, data) => {
  console.log(access_token, keyId, data)
  return axios(`${BASE_URL}/actions/sharing/keys/${keyId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
    data
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

export const importKey = async (access_token, data) => {
  console.log("Access", access_token, data)
  return axios(`${BASE_URL}/actions/sharing/importKey`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + access_token,
    },
    data
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

export const getKeys = async (access_token) => {
  return axios(`${BASE_URL}/actions/sharing/keys`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + access_token,
    },
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const getSharedKeys = async (access_token) => {
  return axios(`${BASE_URL}/actions/sharing/sharedKeys`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + access_token,
    },
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const deleteKeys = async (access_token, data) => {
  return axios(`${BASE_URL}/actions/sharing/deleteKey`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + access_token,
    },
    data
  }).then((response) => response.data)
    .catch((error) => {
      throw error;
    })
}

export const unlinkKeys = async (access_token, data) => {
  return axios(`${BASE_URL}/actions/sharing/unlinkKey`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + access_token,
    },
    data
  }).then((response) => response.data)
    .catch((error) => {
      throw error;
    })
}

export const switchKey = async (access_token, data) => {
  return axios(`${BASE_URL}/actions/sharing/switchKey`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + access_token,
    },
    data
  }).then((response) => response.data)
    .catch((error) => {
      throw error;
    })
}