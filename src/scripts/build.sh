echo "Exporting select source files to lib..."

# delete existing lib directory if it exists
if [ -d ./lib ]; then rm -rf ./lib; fi

echo "  Removed existing lib directory"

# copy the contents of the src dir to the lib dir
cp -R ./src ./lib

echo "  Copied src directory to new lib directory"

# remove the scripts and test directories from lib
rm -rf ./lib/scripts
rm -rf ./lib/tests

echo "  Removed scripts and test directories from lib directory"

echo "Done"