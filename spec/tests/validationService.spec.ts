import ValidationService from '@services/validationService/validationService';
import { ValidationSchema } from '@services/validationService/types';
import {
  ARRAY_OBJECT,
  ARRAY_PRIMITIVE,
  BOOLEAN,
  NUMBER,
  NUMBER_MAX,
  NUMBER_MIN,
  OBJECT,
  REQUIRED,
  STRING,
  STRING_MAX,
  STRING_MIN,
  STRING_NUMBER,
  STRING_NUMBER_MAX,
  STRING_NUMBER_MIN
} from '@services/validationService/validatorKeys';
import ErrorService from '@services/errorService/errorService';
import StatusCodes from 'http-status-codes';
import { ERROR_CODES } from '@shared-with-ui/constants';

const errorService = new ErrorService();

const getError = (errorObj) =>
  errorService.generate(StatusCodes.BAD_REQUEST, ERROR_CODES.INVALID_PARAMS, errorObj);

type MockNested = {
  id: string;
  irrelevant?: any;
}

type MockObject = {
  str: string;
  num: number;
  nestedObj: MockNested,
  objArray: MockNested[],
  primitiveArray: boolean[],
  bool: boolean;
  stringNum: string;
  withExceptions: string | number;
  irrelevant?: any;
}

const MockNestedSchema: ValidationSchema<MockNested> = {
  id: [
    { key: REQUIRED },
    { key: STRING },
  ]
};

const MockSchema: ValidationSchema<MockObject> = {
  str: [
    { key: REQUIRED },
    { key: STRING },
    { key: STRING_MIN, args: [2] },
    { key: STRING_MAX, args: [8] },
  ],
  num: [
    { key: NUMBER },
    { key: NUMBER_MIN, args: [2] },
    { key: NUMBER_MAX, args: [10] },
  ],
  bool: [
    { key: BOOLEAN },
  ],
  nestedObj: [
    { key: OBJECT, schema: MockNestedSchema },
  ],
  objArray: [
    { key: ARRAY_OBJECT, schema: MockNestedSchema },
  ],
  primitiveArray: [
    { key: ARRAY_PRIMITIVE, validators: [{ key: BOOLEAN }]},
  ],
  stringNum: [
    { key: STRING_NUMBER },
    { key: STRING_NUMBER_MIN, args: [2] },
    { key: STRING_NUMBER_MAX, args: [100] },
  ],
  withExceptions: [
    { key: STRING, exceptions: [1000] }
  ],
};

describe('validationService', () => {
  const validationService = new ValidationService();

  const validSchema: MockObject = {
    str: 'str',
    num: 5,
    bool: false,
    nestedObj: {
      id: 'id',
      irrelevant: Infinity,
    },
    objArray: [
      { id: 'id' }, { id: 'id-1' },
    ],
    primitiveArray: [true, false],
    stringNum: '15',
    withExceptions: 'string',
  };

  it('does not throw if schema is valid', () => {
    expect(
      validationService.validateBySchema(validSchema, MockSchema)
    ).toEqual(undefined);
  });

  it(`throws ${REQUIRED} exception`, () => {
    const payload: MockObject = {
      ...validSchema,
      str: undefined,
    };

    try {
      validationService.validateBySchema(payload, MockSchema);
    } catch (e) {
      expect(e).toEqual(getError({ str: REQUIRED }));
    }
  });


  it(`throws ${NUMBER_MAX} exception`, () => {
    const payload: MockObject = {
      ...validSchema,
      num: 5000,
    };

    try {
      validationService.validateBySchema(payload, MockSchema);
    } catch (e) {
      expect(e).toEqual(getError({ num: NUMBER_MAX }));
    }
  });

  it(`throws ${NUMBER_MIN} exception`, () => {
    const payload: MockObject = {
      ...validSchema,
      num: 1,
    };

    try {
      validationService.validateBySchema(payload, MockSchema);
    } catch (e) {
      expect(e).toEqual(getError({ num: NUMBER_MIN }));
    }
  });

  it('throws bool exception', () => {
    const payload: MockObject = {
      ...validSchema,
      bool: 'false' as unknown as boolean
    };

    try {
      validationService.validateBySchema(payload, MockSchema);
    } catch (e) {
      expect(e).toEqual(getError({ bool: BOOLEAN}));
    }
  });

  it(`throws ${OBJECT} exception`, () => {
    const payload: MockObject = {
      ...validSchema,
      nestedObj: 'string' as unknown as MockNested,
    };

    try {
      validationService.validateBySchema(payload, MockSchema);
    } catch (e) {
      expect(e).toEqual(getError({ nestedObj: OBJECT }));
    }
  });

  it(`throws ${ARRAY_OBJECT} exception`, () => {
    const payload: MockObject = {
      ...validSchema,
      objArray: {} as unknown as any[],
    };

    try {
      validationService.validateBySchema(payload, MockSchema);
    } catch (e) {
      expect(e).toEqual(getError({ objArray: ARRAY_OBJECT }));
    }
  });

  it(`throws ${ARRAY_PRIMITIVE} exception`, () => {
    const payload: MockObject = {
      ...validSchema,
      primitiveArray: [{} as unknown as boolean]
    };

    try {
      validationService.validateBySchema(payload, MockSchema);
    } catch (e) {
      expect(e).toEqual(getError({ primitiveArray: ARRAY_PRIMITIVE }));
    }
  });

  it(`throws ${STRING_NUMBER} exception`, () => {
    const payload: MockObject = {
      ...validSchema,
      stringNum: 'xx',
    };

    try {
      validationService.validateBySchema(payload, MockSchema);
    } catch (e) {
      expect(e).toEqual(getError({ stringNum: STRING_NUMBER }));
    }
  });

  it(`throws ${STRING_NUMBER_MIN} exception`, () => {
    const payload: MockObject = {
      ...validSchema,
      stringNum: '0'
    };

    try {
      validationService.validateBySchema(payload, MockSchema);
    } catch (e) {
      expect(e).toEqual(getError({ stringNum: STRING_NUMBER_MIN }));
    }
  });

  it('does not throw if type is wrong but value added to exceptions', () => {
    const payload: MockObject = {
      ...validSchema,
      withExceptions: 1000,
    };

    expect(
      validationService.validateBySchema(payload, MockSchema)
    ).toEqual(undefined);
  });
});
