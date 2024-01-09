# delete existing lib directory if it exists
if [ -d ./lib ]; then rm -rf ./lib; fi

# copy the contents of the src dir to the lib dir
cp -R ./src ./lib

# remove the scripts directory from lib
rm -rf .lib/scripts