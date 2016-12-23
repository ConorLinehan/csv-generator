set -ev

if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
  exit 0
fi

if [ "$TRAVIS_BRANCH" == "master" ]; then
  ember deploy staging
elif [ "$TRAVIS_BRANCH" == "release" ]; then
  ember deploy production
fi
