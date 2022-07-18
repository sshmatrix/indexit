# INDEXIT.eth

cwd=$(pwd)
ensName=$1
message=$2
direc=$3
signature=$4
trans=$5
lang=$6

src='/root/indexit/src/'
dist='/var/www/html/public/'$direc$'/'
resources='/root/indexit/resources/'

# src='/Users/avneetsingh/Documents/Self/Fun/indexIt/backend/src/'
# dist='/Users/avneetsingh/Documents/Self/Fun/indexIt/resources/'
# resources='/Users/avneetsingh/Documents/Self/Fun/indexIt/resources/'
markerFirst='0xfuckthisfuckwhyfuckberaswagmigmgmgmgmggmygmigmiaaauuurrgggggobli'
markerLast='ntownsaylordokwon3acsuzhucelsiusmarkrektlolallwhyplshelpmafamiliia'
ensName=${ensName%.*}
trans=${trans%.*}

if [ "$direc" == "samples" ]; then
    holder=$ensName
    folder=$ensName
    sigFirst=$markerFirst
    sigLast=$markerLast
elif [ "$direc" == "cards" ]; then
    holder=$message
    folder=$ensName
    sigFirst=${signature:0:${#signature}/2}
    sigLast=${signature:${#signature}/2}
fi

mkdir -p ${dist}$folder
chmod 755 ${dist}$folder

status=$(timeout 60 python3 ${src}$'rarity.py' $trans $'all' $'0' $'' $src)
echo $status
if [ -z "${status}" ]; then
    echo "timeout" 1>&2
    exit 64
else
    echo $status
    IFS=',' read -ra ADDR <<< "$status"
    clubName="${ADDR[0]}"
    if [[ "$lang" == "arabic" ]]; then
        if [[ "$clubName" == "999" ]]; then
            clubName="٩٩٩"
        fi
        if [[ "$clubName" == "10k" ]]; then
            clubName="١٠k"
        fi
        if [[ "$clubName" == "100k" ]]; then
            clubName="١٠٠k"
        fi
    fi
    
    if [[ "$lang" == "persian" ]]; then
        if [[ "$clubName" == "999" ]]; then
            clubName="٩٩٩"
        fi
        if [[ "$clubName" == "10k" ]]; then
            clubName="١٠k"
        fi
        if [[ "$clubName" == "100k" ]]; then
            clubName="١٠٠k"
        fi
    fi
    
    if [[ "$lang" == "hindi" ]]; then
        if [[ "$clubName" == "999" ]]; then
            clubName="९९९"
        fi
        if [[ "$clubName" == "10k" ]]; then
            clubName="१०k"
        fi
        if [[ "$clubName" == "100k" ]]; then
            clubName="१००k"
        fi
    fi
    if [[ "$lang" == "english" ]]; then
        if [[ "$clubName" == "999" ]]; then
            clubName="999"
        fi
        if [[ "$clubName" == "10k" ]]; then
            clubName="10k"
        fi
        if [[ "$clubName" == "100k" ]]; then
            clubName="100k"
        fi
    fi
    if [[ "$lang" == "roman" ]]; then
        clubName="Roman"
    fi
    if [[ "$lang" == "chinese" ]]; then
        if [[ "$clubName" == "999" ]]; then
            clubName="九九九"
        fi
        if [[ "$clubName" == "10k" ]]; then
            clubName="十k"
        fi
        if [[ "$clubName" == "100k" ]]; then
            clubName="一百k"
        fi
    fi
    
    if [[ "$lang" == "korean" ]]; then
        if [[ "$clubName" == "999" ]]; then
            clubName="국999"
        fi
        if [[ "$clubName" == "10k" ]]; then
            clubName="국10k"
        fi
        if [[ "$clubName" == "100k" ]]; then
            clubName="국100k"
        fi
    fi
    
    index="${ADDR[1]}"
    isEven="${ADDR[2]}"
    isOdd="${ADDR[3]}"
    isPrime="${ADDR[5]}"
    isPalindrome="${ADDR[4]}"
    primeCount="${ADDR[6]}"
    primeForm="${ADDR[7]}"
    isRepeating="${ADDR[8]}"
    isAlternating="${ADDR[9]}"
    isIncrementing="${ADDR[10]}"

    cardFront=${dist}$folder$'/'$holder$'-Front.svg'
    cardBack=${dist}$folder$'/'$holder$'-Back.svg'

    cp ${resources}$'Card-'$clubName$'-Front.svg' $cardFront
    cp ${resources}$'Card-'$clubName$'-Back.svg' $cardBack

    NFTDir=${dist}$folder$'/'
    NFTFront=$holder$'-Front.png'
    NFTBack=$holder$'-Back.png'
    NFT=$holder$'.png'

    # primeIndex
    # characters=$(( 3 - $(( $(echo $(($index + 1)) | wc -c) - 1 )) ))
    # string=`seq 1 $characters | sed 's/.*/0/' | tr -d '\n'`
    # index=$string$index

    # ensName
    if [[ "$clubName" == "999" || "$clubName" == "९९९" || "$clubName" == "٩٩٩" || "$clubName" == "九九九" || "$clubName" == "국999" ]]; then
        sed -i "s/x1x/$ensName/g" $cardBack
        sed -i "s/x-x/$ensName/g" $cardFront
    elif [[ "$clubName" == "10k" || "$clubName" == "१०k" || "$clubName" == "١٠k" || "$clubName" == "十k" || "$clubName" == "국10k" ]]; then
        sed -i "s/xxxx/$ensName/g" $cardBack
        sed -i "s/xxxx/$ensName/g" $cardFront
    elif [[ "$clubName" == "100k" || "$clubName" == "१००k" || "$clubName" == "١٠٠k" || "$clubName" == "一百k" || "$clubName" == "국100k" ]]; then
        sed -i "s/xxxxx/$ensName/g" $cardBack
        sed -i "s/xxxxx/$ensName/g" $cardFront
    elif [[ "$clubName" == "0xdigit" ]]; then
        sed -i -e "s/0xxxxxx/$ensName/g" $cardBack
        sed -i "s/0xxxxxx/$ensName/g" $cardFront
    elif [[ "$clubName" == "24h" ]]; then
        sed -i "s/xxhxx/$ensName/g" $cardBack
        sed -i "s/xxhxx/$ensName/g" $cardFront
    elif [[ "$clubName" == "Roman" ]]; then
        sed -i "s/xxxxxxxxxx/${ensName^^}/g" $cardBack
        sed -i "s/xxxxxxxxxx/${ensName^^}/g" $cardFront
    fi

    sed -i "s/YZK/$index/g" $cardBack
    sed -i "s/YOL1/$isEven/g" $cardBack
    sed -i "s/NOL1/$isOdd/g" $cardBack
    sed -i "s/YOL2/$isPalindrome/g" $cardBack
    sed -i "s/NOL2/$isPrime/g" $cardBack
    sed -i "s/YOL3/$isRepeating/g" $cardBack
    sed -i "s/NOL3/$isAlternating/g" $cardBack
    sed -i "s/YOL4/$isIncrementing/g" $cardBack
    sed -i "s/_-/$primeCount/g" $cardBack
    sed -i "s/$markerFirst/$sigFirst/g" $cardBack
    sed -i "s/$markerLast/$sigLast/g" $cardBack
    sed -i "s/$markerFirst/$sigFirst/g" $cardFront
    sed -i "s/$markerLast/$sigLast/g" $cardFront
        
    IFS='-' read -ra ADDR <<< "$primeForm"
    countB="${ADDR[1]}"
    sed -i "s/2<\/tspan>C/$countB<\/tspan>C/g" $cardBack
    countC="${ADDR[2]}"
    sed -i "s/4<\/tspan>D/$countC<\/tspan>D/g" $cardBack
    countD="${ADDR[3]}"
    sed -i "s/1<\/tspan>E/$countD<\/tspan>E/g" $cardBack
    countE="${ADDR[4]}"
    sed -i "s/3<\/tspan>F/$countE<\/tspan>F/g" $cardBack
    countF="${ADDR[5]}"
    sed -i "s/5<\/tspan>G/$countF<\/tspan>G/g" $cardBack
    countG="${ADDR[6]}"
    sed -i "s/3<\/tspan>H/$countG<\/tspan>H/g" $cardBack
    countH="${ADDR[7]}"
    sed -i "s/4<\/tspan>I/$countH<\/tspan>I/g" $cardBack
    countI="${ADDR[8]}"
    sed -i "s/2<\/tspan>L/$countI<\/tspan>L/g" $cardBack
    countL="${ADDR[9]}"
    sed -i "s/4<\/tspan>M/$countL<\/tspan>M/g" $cardBack
    countM="${ADDR[10]}"
    sed -i "s/6<\/tspan>N/$countM<\/tspan>N/g" $cardBack
    countN="${ADDR[11]}"
    sed -i "s/1<\/tspan>P/$countN<\/tspan>P/g" $cardBack
    countP="${ADDR[12]}"
    sed -i "s/11<\/tspan>Q/$countP<\/tspan>Q/g" $cardBack
    countQ="${ADDR[13]}"
    sed -i "s/2<\/tspan>R/$countQ<\/tspan>R/g" $cardBack
    countR="${ADDR[14]}"
    sed -i "s/2<\/tspan>S/$countR<\/tspan>S/g" $cardBack
    countS="${ADDR[15]}"
    sed -i "s/9<\/tspan>T/$countS<\/tspan>T/g" $cardBack
    countT="${ADDR[16]}"
    sed -i "s/4<\/tspan>U/$countT<\/tspan>U/g" $cardBack
    countU="${ADDR[17]}"
    sed -i "s/1<\/tspan>W/$countU<\/tspan>W/g" $cardBack
    countW="${ADDR[18]}"
    sed -i "s/>5<\/tspan>/>$countW<\/tspan>/g" $cardBack

    # rm -r ${dist}$ensName
    cd $NFTDir
    # echo "SVG Written; Exporting PNG"
    inkscape --without-gui -d 300 --export-area-drawing "$cardFront" -e "$NFTFront" > /dev/null 2>&1
    inkscape --without-gui -d 300 --export-area-drawing "$cardBack" -e "$NFTBack" > /dev/null 2>&1
    convert +append $NFTDir$NFTFront $NFTDir$NFTBack $NFTDir$NFT
    cd $cwd
    # echo "PNG Generated"
fi

