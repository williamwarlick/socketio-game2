const BLOCK_TYPE = {
    RED: 'RED',
    GREEN: 'GREEN',
    BLUE: 'BLUE',
    EMPTY: 'WHITE',
}

const SPACE_STATUS = {
    OPEN: 'OPEN',
    CLOSED: 'CLOSED',
}

const EVENTS = {
    DRAGSTART: 'dragstart',
    DRAGOVER: 'dragover',
    DROP: 'drop',
    NONE: 'none',
};

class Space {
    constructor(blockType) {
        this.blockType = blockType;
        this.status = SPACE_STATUS.OPEN;
    }

    equals(space) {
        return this.blockType === space.blockType;
    }
}

const o = () => { return new Space(BLOCK_TYPE.EMPTY)};
const r = () => { return new Space(BLOCK_TYPE.RED)};
const b = () => { return new Space(BLOCK_TYPE.BLUE)};
const g = () => { return new Space(BLOCK_TYPE.GREEN)};

class Section {
    constructor(section, subsection) {
        this.section = section;
        this.subsection = subsection;
    }

    toString() {
        return this.section + (this.subsection ? this.subsection + 1 : '');
    }
}

if (module && module.exports) {
    module.exports = {SPACE_STATUS,BLOCK_TYPE, o, r, b, g, Section, Space, EVENTS};
}