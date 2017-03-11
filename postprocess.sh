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
sed -i 's/— /— /g' $FILE

