# delete existing lib directory if it exists
if [ -d ./lib ]; then rm -rf ./lib; fi

# copy the contents of the src dir to the lib dir
cp -R ./src ./lib

# remove the scripts and test directories from lib
rm -rf ./lib/scripts
rm -rf ./lib/tests