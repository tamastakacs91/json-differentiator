const differences = require('./diff.js');
const {
  data,
  expectNoDiffs,
  expectDiff,
} = require('./testUtils.js')

test('type diff for string and number', () => {
  // given
  let original = "1"
  let updated = 1

  // when
  const result = differences(original, updated)

  // then
  expectDiff(result, [{
    type: "TYPE_DIFF",
    path: "",
    left: "string",
    right: "number"
  }])
})

test('empty list for no change', () => {
  // given
  let original = data()
  let updated = data()

  // when
  const result = differences(original, updated)

  // then
  expectNoDiffs(result)
})

test('type change top level', () => {
  // given
  let original = data()
  let updated = data()
  original['version'] = 1
  updated['version'] = "1"

  // when
  const result = differences(original, updated)

  // then
  expectDiff(result, [{
    type: "TYPE_DIFF",
    path: ".version",
    left: "number",
    right: "string"
  }])
})

test('value change top level', () => {
  // given
  let original = data()
  let updated = data()
  original['version'] = 1
  updated['version'] = 2

  // when
  const result = differences(original, updated)

  // then
  expectDiff(result, [{
    type: "VALUE_DIFF",
    path: ".version",
    left: 1,
    right: 2
  }])
})

test('type change in deep', () => {
  // given
  let original = data()
  let updated = data()
  original['localizations']['test_localization'] = "alma"
  updated['localizations']['test_localization'] = 1

  // when
  const result = differences(original, updated)

  // then
  expectDiff(result, [{
    type: "TYPE_DIFF",
    path: ".localizations.test_localization",
    left: "string",
    right: "number"
  }])
})

/* --------------------------------------------------- */

test('value change in deep', () => {
  // given
  let original = data()
  let updated = data()
  original['localizations']['test_localization'] = "alma"
  updated['localizations']['test_localization'] = "banana"

  // when
  const result = differences(original, updated)

  // then
  expectDiff(result, [{
    type: "VALUE_DIFF",
    path: ".localizations.test_localization",
    left: "alma",
    right: "banana"
  }])
})

test('added key top level', () => {
  // given
  let original = data()
  let updated = data()
  
  updated['versionControl'] = "yes"

  // when
  const result = differences(original, updated)

  // then
  expectDiff(result, [{
    type: "ADDED_KEY",
    path: ".versionControl",
    left: null,
    right: "yes"
  }])
})

test('deleted key top level', () => {
  // given
  let original = data()
  let updated = data()
  
  original['versionConfig'] = 1.3

  // when
  const result = differences(original, updated)

  // then
  expectDiff(result, [{
    type: "DELETED_KEY",
    path: ".versionConfig",
    left: 1.3,
    right: null
  }])
})

test('added key in deep', () => {
  // given
  let original = data()
  let updated = data()
  
  updated['configs']['dashboard_greeting']['description'] = "greeting"

  // when
  const result = differences(original, updated)

  // then
  expectDiff(result, [{
    type: "ADDED_KEY",
    path: ".configs.dashboard_greeting.description",
    left: null,
    right: "greeting"
  }])
})

test('deleted key in deep', () => {
  // given
  let original = data()
  let updated = data()
  
  original['configs']['topup_amount']['description'] = "top-up"

  // when
  const result = differences(original, updated)

  // then
  expectDiff(result, [{
    type: "DELETED_KEY",
    path: ".configs.topup_amount.description",
    left: "top-up",
    right: null
  }])
})

test('added item', () => {
  // given
  let original = data()
  let updated = data()

  original['validations']['login-pwd'] = []

  updated['validations']['login-pwd'] = [
    {ref: "8",
    regex: "^(20|30|31|50|70)$",
    message: "start_with_valid_prefix",
    rank: 7}
  ]


  // when
  const result = differences(original, updated)
  

  // then
  expectDiff(result, [{
    type: "ADDED_ITEM",
    path: '.validations.login-pwd.[#item:{"message":"start_with_valid_prefix"}]',
    left: null,
    right: {
    ref: "8",
    regex: "^(20|30|31|50|70)$",
    message: "start_with_valid_prefix",
    rank: 7
    }
  }])
})

test('deleted item', () => {
  // given
  let original = data()
  let updated = data()

  original['validations']['login-user'] = [
    {ref: "6",
    regex: "^(20|30|31|50|70)$",
    message: "start_with_valid_prefix",
    rank: 6}
  ]

  updated['validations']['login-user'] = []


  // when
  const result = differences(original, updated)
  

  // then
  expectDiff(result, [{
    type: "DELETED_ITEM",
    path: '.validations.login-user.[#item:{"message":"start_with_valid_prefix"}]',
    left: {
      ref: "6",
      regex: "^(20|30|31|50|70)$",
      message: "start_with_valid_prefix",
      rank: 6
    },
    right: null
  }])
})
 

test('deep deleted key, deleted and added item', () => {
  // given
  let original = data()
  let updated = data()

  original['configs']['topup_amount']['description'] = "top-up"

  original['validations']['login-user'] = [
    {ref: "6",
    regex: "^(20|30|31|50|70)$",
    message: "start_with_valid_prefix",
    rank: 6}
  ]

  updated['validations']['login-user'] = [
    {ref: "7",
    regex: "^(20|30|31|50|70)$",
    message: "start_with_valid_prefix",
    rank: 7}
  ]


  // when
  const result = differences(original, updated)
  

  // then
  expectDiff(result, [
    { type: 'ADDED_ITEM',
    path:
     '.validations.login-user.[#item:{"message":"start_with_valid_prefix"}]',
    left: null,
    right:{
      ref: '7',
      regex: '^(20|30|31|50|70)$',
      message: 'start_with_valid_prefix',
      rank: 7 }
  },
    {
    type: "DELETED_ITEM",
    path: '.validations.login-user.[#item:{"message":"start_with_valid_prefix"}]',
    left: {
      ref: "6",
      regex: "^(20|30|31|50|70)$",
      message: "start_with_valid_prefix",
      rank: 6
    },
    right: null
  },
  {
    type: "DELETED_KEY",
    path: ".configs.topup_amount.description",
    left: "top-up",
    right: null
  },
  
  ])
})
