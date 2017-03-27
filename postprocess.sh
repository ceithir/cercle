#!/bin/bash

readonly FILE=$1

sed -i 's/« /« /g' $FILE
sed -i 's/ »/ »/g' $FILE
sed -i 's/ !/ !/g' $FILE
sed -i 's/ ?/ ?/g' $FILE
sed -i 's/ :/ :/g' $FILE
sed -i 's/ ;/ ;/g' $FILE
sed -i 's/\.\.\./…/g' $FILE
sed -i "s/'/’/g" $FILE
sed -i 's/<p>- /<p>— /g' $FILE
sed -i 's/ - / — /g' $FILE # Non-breakable spaces for floating dashes must be handled by hand right now

