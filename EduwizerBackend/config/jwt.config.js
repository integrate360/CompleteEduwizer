const jwt = require('jsonwebtoken')

module.exports = {
  genToken: function (payload, expiresInTime) {
    return new Promise(function (resolve, reject) {
      jwt.sign(
        { payload },
        process.env.secret,
        { expiresIn: expiresInTime },
        function (err, token) {
          if (err) {
            reject(err)
          } else {
            resolve(token)
          }
        }
      )
    })
  },

  getPayload: function (token) {
    return new Promise(function (resolve, reject) {
      jwt.verify(token, process.env.JWT_SECERT, function (err, authorizedata) {
        if (err) {
          reject(false)
        } else {
          resolve(authorizedata.payload)
        }
      })
    })
  },

  generateToken: function (payload, secret, options) {
    return new Promise(function (resolve, reject) {
      try {
        jwt.sign({ payload }, secret, options, function (err, token) {
          if (err) {
            reject(err)
          } else {
            resolve(token)
          }
        })
      } catch (error) {
        reject(error)
      }
    })
  },

  checkToken: function (req, res, next) {
    try {
      const header = req.headers.authorization
      console.log('Received Authorization Header:', header);
      console.log('Received Authorization Header:', header);

      if (typeof header !== 'undefined' && header.length !== 0) {
        const bearer = header.split(' ')
        // If there's a prefix (e.g. "Bearer token"), use bearer[1]. Otherwise, use bearer[0]
        const token = (bearer.length > 1 ? bearer[1] : bearer[0]).trim()
        console.log('Extracted Token for Verification:', token);

        jwt.verify(
          token,
          process.env.secret,
          async function (err, authorizedata) {
            if (err) {
              console.error('JWT Verify Error:', err.name, err.message);
              if (err.name === 'TokenExpiredError') {
                return res.status(403).json({ success: 0, data: [], message: err.message })
              } else if (err.name === 'JsonWebTokenError') {
                return res.status(403).json({ success: 0, data: [], message: 'JWT Error: ' + err.message })
              }
            } else {
              console.log('JWT Verification Successful');
              const { payload } = authorizedata
              req.payload = payload
              next()
            }
          }
        )
      } else {
        console.log('Authorization header is missing or empty');
        return res.status(403).json({ success: 0, data: [], message: 'Authorization failed.' })
      }
    } catch (error) {
      console.error('checkToken Catch Error:', error);
      return res.status(400).json({ success: 0, data: [], message: error.message })
    }
  },

  verifyToken: function (token, secret) {
    return new Promise(function (resolve, reject) {
      jwt.verify(token, secret, function (err, authorizedata) {
        if (err) {
          reject(false);
        } else {
          resolve(authorizedata.payload);
        }
      });
    });
  },

  checkAuthorizationKey: function (req, res, next) {
    try {
      const { access_key } = req.headers
      if (
        typeof access_key !== 'string' ||
        access_key !== process.env.access_key
      ) {
        res.status(403).json({ success: 0, data: [], message: 'Invalid access key.' })
      } else {
        next()
      }
    } catch (error) {
      console.log('error', error)
      return res.status(400).json({ success: 0, data: [], message: error.message })
    }
  }
}
