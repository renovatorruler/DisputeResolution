# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_DisputeResolution_session',
  :secret      => '0c37adfde9d0c2703d24e0e7bc67deb5b2e1bc22417910b847768f9af434b334a97ff26fb45f0dda33508b28b85c92b4503bb3d3f597064e2e1f824fedf44b00'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
